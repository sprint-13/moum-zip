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

  it("정규화한 프로필 값으로 memberQueries.update를 호출한다", async () => {
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

  it("빈 이메일과 아바타 URL은 null로 정규화한다", async () => {
    await updateMemberProfileUseCase({
      avatarUrl: "   ",
      email: "",
      nickname: "닉네임",
      spaceId: "space-1",
      userId: 7,
    });

    expect(mockUpdate).toHaveBeenCalledWith("space-1", 7, {
      avatarUrl: null,
      email: null,
      nickname: "닉네임",
    });
  });

  it("닉네임이 비어 있으면 에러를 던진다", async () => {
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

  it("업데이트할 멤버가 없으면 에러를 던진다", async () => {
    mockUpdate.mockResolvedValue(undefined as never);

    await expect(
      updateMemberProfileUseCase({
        nickname: "닉네임",
        spaceId: "space-1",
        userId: 7,
      }),
    ).rejects.toThrow("멤버 정보를 찾을 수 없습니다.");
  });
});
