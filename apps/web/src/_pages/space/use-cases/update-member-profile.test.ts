import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/entities/member", () => ({
  memberQueries: {
    update: vi.fn(),
  },
}));

import { memberQueries } from "@/entities/member";
import { updateMemberProfileUseCase } from "./update-member-profile";

const mockUpdate = vi.mocked(memberQueries.update);

const BASE_MEMBER = {
  avatarUrl: null,
  email: null,
  id: "member-1",
  joinedAt: "2026-03-31T00:00:00.000Z",
  nickname: "기존 닉네임",
  role: "member" as const,
  spaceId: "space-1",
  userId: 7,
};

describe("updateMemberProfileUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockResolvedValue(BASE_MEMBER);
  });

  it("전달된 필드를 정규화한 뒤 수정한다", async () => {
    const result = await updateMemberProfileUseCase({
      avatarUrl: "  https://example.com/avatar.png  ",
      email: "  user@example.com  ",
      nickname: "  새 닉네임  ",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      avatarUrl: "https://example.com/avatar.png",
      email: "user@example.com",
      nickname: "새 닉네임",
    });
    expect(result).toEqual(BASE_MEMBER);
  });

  it("닉네임만 전달되면 닉네임만 수정한다", async () => {
    await updateMemberProfileUseCase({
      nickname: "새 닉네임",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      nickname: "새 닉네임",
    });
  });

  it("이메일만 전달되면 이메일만 수정한다", async () => {
    await updateMemberProfileUseCase({
      email: "  user@example.com  ",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      email: "user@example.com",
    });
  });

  it("아바타 URL만 전달되면 아바타 URL만 수정한다", async () => {
    await updateMemberProfileUseCase({
      avatarUrl: "  https://example.com/avatar.png  ",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      avatarUrl: "https://example.com/avatar.png",
    });
  });

  it("이메일과 아바타 URL을 빈 값으로 보내면 null로 정규화한다", async () => {
    await updateMemberProfileUseCase({
      avatarUrl: "   ",
      email: "",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      avatarUrl: null,
      email: null,
    });
  });

  it("닉네임이 전달됐지만 비어 있으면 에러를 던진다", async () => {
    await expect(
      updateMemberProfileUseCase({
        nickname: "   ",
        spaceId: "space-1",
        userId: 7,
      }),
    ).rejects.toThrow("닉네임을 입력해주세요.");

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("닉네임이 20자를 초과하면 에러를 던진다", async () => {
    await expect(
      updateMemberProfileUseCase({
        nickname: "123456789012345678901",
        spaceId: "space-1",
        userId: 7,
      }),
    ).rejects.toThrow("닉네임은 20자 이하로 입력해주세요.");

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("수정할 필드가 하나도 없으면 에러를 던진다", async () => {
    await expect(
      updateMemberProfileUseCase({
        spaceId: "space-1",
        userId: 7,
      }),
    ).rejects.toThrow("수정할 프로필 정보가 없습니다.");

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("수정 대상 멤버가 없으면 에러를 던진다", async () => {
    mockUpdate.mockResolvedValue(undefined as never);

    await expect(
      updateMemberProfileUseCase({
        nickname: "새 닉네임",
        spaceId: "space-1",
        userId: 7,
      }),
    ).rejects.toThrow("멤버 정보를 찾을 수 없습니다.");
  });
});
