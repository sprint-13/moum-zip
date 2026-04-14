import { beforeEach, describe, expect, it, vi } from "vitest";
import { memberQueries } from "@/entities/member/queries";
import { createNotification } from "./create-notification";
import { createSpaceMemberNotifications } from "./create-space-member-notification";

vi.mock("@/entities/member/queries", () => ({
  memberQueries: {
    findUserIdsBySpaceId: vi.fn(),
  },
}));

vi.mock("./create-notification", () => ({
  createNotification: vi.fn(),
}));

describe("createSpaceMemberNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("actor를 제외한 스페이스 멤버들에게 알림을 생성한다", async () => {
    vi.mocked(memberQueries.findUserIdsBySpaceId).mockResolvedValue([{ userId: 1 }, { userId: 2 }, { userId: 3 }]);

    vi.mocked(createNotification).mockResolvedValue({
      id: "notification-1",
      teamId: "space-1",
      userId: 1,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
      isRead: false,
      createdAt: new Date(),
    } as never);

    await createSpaceMemberNotifications({
      spaceId: "space-1",
      actorId: 2,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
    });

    expect(memberQueries.findUserIdsBySpaceId).toHaveBeenCalledWith("space-1");

    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(createNotification).toHaveBeenNthCalledWith(1, {
      teamId: "space-1",
      userId: 1,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
    });
    expect(createNotification).toHaveBeenNthCalledWith(2, {
      teamId: "space-1",
      userId: 3,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
    });
  });

  it("data가 없으면 빈 객체로 알림을 생성한다", async () => {
    vi.mocked(memberQueries.findUserIdsBySpaceId).mockResolvedValue([{ userId: 1 }, { userId: 2 }]);

    vi.mocked(createNotification).mockResolvedValue({} as never);

    await createSpaceMemberNotifications({
      spaceId: "space-1",
      actorId: 1,
      type: "SPACE_MEMBER_ACCEPTED",
      message: "새 멤버가 승인되었습니다.",
    });

    expect(createNotification).toHaveBeenCalledTimes(1);
    expect(createNotification).toHaveBeenCalledWith({
      teamId: "space-1",
      userId: 2,
      type: "SPACE_MEMBER_ACCEPTED",
      message: "새 멤버가 승인되었습니다.",
      data: {},
    });
  });

  it("actor 외에 알림을 보낼 멤버가 없으면 createNotification을 호출하지 않는다", async () => {
    vi.mocked(memberQueries.findUserIdsBySpaceId).mockResolvedValue([{ userId: 1 }]);

    await createSpaceMemberNotifications({
      spaceId: "space-1",
      actorId: 1,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
    });

    expect(memberQueries.findUserIdsBySpaceId).toHaveBeenCalledWith("space-1");
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("일부 알림 생성이 실패해도 전체 함수는 에러 없이 종료된다", async () => {
    vi.mocked(memberQueries.findUserIdsBySpaceId).mockResolvedValue([{ userId: 1 }, { userId: 2 }, { userId: 3 }]);

    vi.mocked(createNotification)
      .mockResolvedValueOnce({} as never)
      .mockRejectedValueOnce(new Error("알림 생성 실패"));

    await expect(
      createSpaceMemberNotifications({
        spaceId: "space-1",
        actorId: 3,
        type: "COMMENT",
        message: "새 댓글이 달렸습니다.",
        data: { postId: "post-1" },
      }),
    ).resolves.toBeUndefined();

    expect(createNotification).toHaveBeenCalledTimes(2);
  });
});
