import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/_pages/space/actions", () => ({
  updateMemberProfileAction: vi.fn(),
}));

vi.mock("@/_pages/space/use-cases/upload-profile-image", () => ({
  uploadProfileImage: vi.fn(),
}));

import { updateMemberProfileAction } from "@/_pages/space/actions";
import { uploadProfileImage } from "@/_pages/space/use-cases/upload-profile-image";
import { saveSpaceMemberProfileUseCase } from "./save-space-member-profile";

const mockUpdateMemberProfileAction = vi.mocked(updateMemberProfileAction);
const mockUploadProfileImage = vi.mocked(uploadProfileImage);

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
    mockUploadProfileImage.mockResolvedValue("https://cdn.example.com/profile-after.png");
  });

  it("변경된 필드가 없으면 저장하지 않는다", async () => {
    const result = await saveSpaceMemberProfileUseCase({
      editingImageFile: null,
      editingProfile: INITIAL_PROFILE,
      initialProfile: INITIAL_PROFILE,
      slug: "space-slug",
    });

    expect(result).toBeNull();
    expect(mockUploadProfileImage).not.toHaveBeenCalled();
    expect(mockUpdateMemberProfileAction).not.toHaveBeenCalled();
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

    expect(mockUpdateMemberProfileAction).toHaveBeenCalledWith("space-slug", {
      nickname: "새 닉네임",
    });
    expect(result).toEqual(UPDATED_MEMBER);
  });

  it("이미지가 있으면 업로드 후 avatarUrl을 포함해 저장한다", async () => {
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

    expect(mockUploadProfileImage).toHaveBeenCalledWith(file);
    expect(mockUpdateMemberProfileAction).toHaveBeenCalledWith("space-slug", {
      avatarUrl: "https://cdn.example.com/profile-after.png",
      nickname: "새 닉네임",
    });
    expect(result).toEqual(UPDATED_MEMBER);
  });

  it("이미지 업로드에 실패하면 에러를 던진다", async () => {
    mockUploadProfileImage.mockRejectedValue(new Error("업로드 실패"));
    const file = new File(["content"], "profile.png", { type: "image/png" });

    await expect(
      saveSpaceMemberProfileUseCase({
        editingImageFile: file,
        editingProfile: INITIAL_PROFILE,
        initialProfile: INITIAL_PROFILE,
        slug: "space-slug",
      }),
    ).rejects.toThrow("업로드 실패");

    expect(mockUpdateMemberProfileAction).not.toHaveBeenCalled();
  });
});
