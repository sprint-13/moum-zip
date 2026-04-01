import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/_pages/space/actions", () => ({
  revalidateSpaceProfileAction: vi.fn(),
  updateMemberProfileAction: vi.fn(),
}));

vi.mock("@/_pages/space/use-cases/upload-profile-image", () => ({
  getProfileImagePresignedUrl: vi.fn(),
  putProfileImage: vi.fn(),
}));

import { revalidateSpaceProfileAction, updateMemberProfileAction } from "@/_pages/space/actions";
import { getProfileImagePresignedUrl, putProfileImage } from "@/_pages/space/use-cases/upload-profile-image";
import { saveSpaceMemberProfileUseCase } from "./save-space-member-profile";

const mockUpdateMemberProfileAction = vi.mocked(updateMemberProfileAction);
const mockRevalidateSpaceProfileAction = vi.mocked(revalidateSpaceProfileAction);
const mockGetProfileImagePresignedUrl = vi.mocked(getProfileImagePresignedUrl);
const mockPutProfileImage = vi.mocked(putProfileImage);

const INITIAL_PROFILE = {
  avatarUrl: "https://cdn.example.com/profile-before.png",
  email: "before@example.com",
  nickname: "기존 닉네임",
};

const UPDATED_MEMBER = {
  avatarUrl: "https://cdn.example.com/profile-after.png",
  email: "after@example.com",
  id: "member-1",
  joinedAt: "2026-04-01T00:00:00.000Z",
  nickname: "새 닉네임",
  role: "member" as const,
  spaceId: "space-1",
  userId: 1,
};

describe("saveSpaceMemberProfileUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateMemberProfileAction.mockResolvedValue({
      member: UPDATED_MEMBER,
    });
    mockGetProfileImagePresignedUrl.mockResolvedValue({
      presignedUrl: "https://s3.example.com/presigned",
      publicUrl: "https://cdn.example.com/profile-after.png",
    });
    mockPutProfileImage.mockResolvedValue();
    mockRevalidateSpaceProfileAction.mockResolvedValue();
  });

  it("변경된 필드가 없으면 저장하지 않는다", async () => {
    const result = await saveSpaceMemberProfileUseCase({
      editingImageFile: null,
      editingProfile: INITIAL_PROFILE,
      initialProfile: INITIAL_PROFILE,
      slug: "space-slug",
    });

    expect(result).toBeNull();
    expect(mockUpdateMemberProfileAction).not.toHaveBeenCalled();
    expect(mockGetProfileImagePresignedUrl).not.toHaveBeenCalled();
  });

  it("텍스트 필드만 변경되면 변경된 값만 저장한다", async () => {
    const result = await saveSpaceMemberProfileUseCase({
      editingImageFile: null,
      editingProfile: {
        ...INITIAL_PROFILE,
        nickname: "  새 닉네임  ",
      },
      initialProfile: INITIAL_PROFILE,
      slug: "space-slug",
    });

    expect(mockUpdateMemberProfileAction).toHaveBeenCalledWith(
      "space-slug",
      {
        nickname: "새 닉네임",
      },
      {
        shouldRevalidate: true,
      },
    );
    expect(mockGetProfileImagePresignedUrl).not.toHaveBeenCalled();
    expect(result).toEqual(UPDATED_MEMBER);
  });

  it("이미지를 변경하면 업로드 URL 발급, 저장, 업로드, 재검증 순서로 처리한다", async () => {
    const file = new File(["content"], "profile.png", { type: "image/png" });

    const result = await saveSpaceMemberProfileUseCase({
      editingImageFile: file,
      editingProfile: {
        ...INITIAL_PROFILE,
        nickname: "새 닉네임",
      },
      initialProfile: INITIAL_PROFILE,
      slug: "space-slug",
    });

    expect(mockGetProfileImagePresignedUrl).toHaveBeenCalledWith("profile.png", "image/png");
    expect(mockUpdateMemberProfileAction).toHaveBeenCalledWith(
      "space-slug",
      {
        avatarUrl: "https://cdn.example.com/profile-after.png",
        nickname: "새 닉네임",
      },
      {
        shouldRevalidate: false,
      },
    );
    expect(mockPutProfileImage).toHaveBeenCalledWith("https://s3.example.com/presigned", file);
    expect(mockRevalidateSpaceProfileAction).toHaveBeenCalledWith("space-slug");
    expect(result).toEqual(UPDATED_MEMBER);
  });

  it("이미지 업로드에 실패하면 저장 내용을 되돌리고 에러를 던진다", async () => {
    mockPutProfileImage.mockRejectedValue(new Error("업로드 실패"));
    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(
      saveSpaceMemberProfileUseCase({
        editingImageFile: file,
        editingProfile: {
          avatarUrl: "blob:preview",
          email: "after@example.com",
          nickname: "새 닉네임",
        },
        initialProfile: INITIAL_PROFILE,
        slug: "space-slug",
      }),
    ).rejects.toThrow("프로필 이미지 업로드에 실패해 변경 내용을 되돌렸어요. 다시 시도해 주세요.");

    expect(mockUpdateMemberProfileAction).toHaveBeenNthCalledWith(
      1,
      "space-slug",
      {
        avatarUrl: "https://cdn.example.com/profile-after.png",
        email: "after@example.com",
        nickname: "새 닉네임",
      },
      {
        shouldRevalidate: false,
      },
    );
    expect(mockUpdateMemberProfileAction).toHaveBeenNthCalledWith(
      2,
      "space-slug",
      {
        avatarUrl: "https://cdn.example.com/profile-before.png",
        email: "before@example.com",
        nickname: "기존 닉네임",
      },
      {
        shouldRevalidate: false,
      },
    );
    expect(mockRevalidateSpaceProfileAction).not.toHaveBeenCalled();
  });

  it("되돌리기에도 실패하면 별도 에러를 던진다", async () => {
    mockPutProfileImage.mockRejectedValue(new Error("업로드 실패"));
    mockUpdateMemberProfileAction
      .mockResolvedValueOnce({
        member: UPDATED_MEMBER,
      })
      .mockRejectedValueOnce(new Error("되돌리기 실패"));

    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(
      saveSpaceMemberProfileUseCase({
        editingImageFile: file,
        editingProfile: {
          ...INITIAL_PROFILE,
          nickname: "새 닉네임",
        },
        initialProfile: INITIAL_PROFILE,
        slug: "space-slug",
      }),
    ).rejects.toThrow("프로필 이미지 업로드에 실패했고 변경 내용을 되돌리지 못했어요. 새로고침 후 다시 시도해 주세요.");
  });
});
