import { describe, expect, it, vi } from "vitest";
import { createNotification } from "./create-notification";

describe("createNotification", () => {
  it("알림을 생성하고 생성된 알림을 반환한다", async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: "mock-notification-id",
        teamId: "team-1",
        userId: 1,
        type: "COMMENT",
        message: "새 댓글이 달렸습니다.",
        data: { postId: "post-1" },
        isRead: false,
      },
    ]);

    const values = vi.fn(() => ({ returning }));
    const insert = vi.fn(() => ({ values }));

    const database = {
      insert,
    } as never;

    const result = await createNotification(
      {
        teamId: "team-1",
        userId: 1,
        type: "COMMENT",
        message: "새 댓글이 달렸습니다.",
        data: { postId: "post-1" },
      },
      {
        database,
        createId: () => "mock-notification-id",
      },
    );

    expect(insert).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledWith({
      id: "mock-notification-id",
      teamId: "team-1",
      userId: 1,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
      isRead: false,
    });
    expect(returning).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: "mock-notification-id",
      teamId: "team-1",
      userId: 1,
      type: "COMMENT",
      message: "새 댓글이 달렸습니다.",
      data: { postId: "post-1" },
      isRead: false,
    });
  });

  it("data가 없으면 기본값으로 빈 객체를 저장한다", async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: "mock-notification-id",
        teamId: "team-1",
        userId: 2,
        type: "MEETING_CONFIRMED",
        message: "모임이 확정되었습니다.",
        data: {},
        isRead: false,
      },
    ]);

    const values = vi.fn(() => ({ returning }));
    const insert = vi.fn(() => ({ values }));

    const database = {
      insert,
    } as never;

    await createNotification(
      {
        teamId: "team-1",
        userId: 2,
        type: "MEETING_CONFIRMED",
        message: "모임이 확정되었습니다.",
      },
      {
        database,
        createId: () => "mock-notification-id",
      },
    );

    expect(values).toHaveBeenCalledWith({
      id: "mock-notification-id",
      teamId: "team-1",
      userId: 2,
      type: "MEETING_CONFIRMED",
      message: "모임이 확정되었습니다.",
      data: {},
      isRead: false,
    });
  });
});
