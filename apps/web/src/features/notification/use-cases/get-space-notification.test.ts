import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSpaceNotifications } from "./get-space-notification";

function createDatabaseMock(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue(rows);
  const orderBy = vi.fn(() => ({ limit }));
  const where = vi.fn(() => ({ orderBy }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));

  return {
    database: {
      select,
    } as never,
    mocks: {
      select,
      from,
      where,
      orderBy,
      limit,
    },
  };
}

describe("getSpaceNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("알림 목록을 NotificationItem 형태로 변환해 반환한다", async () => {
    const createdAt = new Date("2026-04-14T10:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "새 댓글이 달렸습니다.",
        data: {
          postId: 123,
          commentId: 456,
          commentAuthorName: "모음집",
          commentContent: "테스트 댓글",
          image: null,
        },
        isRead: false,
        createdAt,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1 }, { database });

    expect(result).toEqual({
      data: [
        {
          id: "noti-1",
          teamId: "space-1",
          userId: 1,
          type: "COMMENT",
          message: "새 댓글이 달렸습니다.",
          data: {
            meetingId: undefined,
            meetingName: undefined,
            postId: "123",
            postTitle: undefined,
            commentId: "456",
            commentAuthorName: "모음집",
            commentContent: "테스트 댓글",
            spaceSlug: undefined,
            image: null,
          },
          isRead: false,
          createdAt,
          source: "internal",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });
  });

  it("알 수 없는 type은 COMMENT로 정규화한다", async () => {
    const createdAt = new Date("2026-04-14T10:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "UNKNOWN_TYPE",
        message: "알 수 없는 알림입니다.",
        data: {},
        isRead: false,
        createdAt,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1 }, { database });

    expect(result.data[0]?.type).toBe("COMMENT");
  });

  it("data가 객체가 아니면 빈 객체로 정규화한다", async () => {
    const createdAt = new Date("2026-04-14T10:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "새 댓글이 달렸습니다.",
        data: null,
        isRead: false,
        createdAt,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1 }, { database });

    expect(result.data[0]?.data).toEqual({});
  });

  it("hasMore가 true면 size만큼만 반환하고 nextCursor를 생성한다", async () => {
    const row1Date = new Date("2026-04-14T10:00:00.000Z");
    const row2Date = new Date("2026-04-14T09:00:00.000Z");
    const row3Date = new Date("2026-04-14T08:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-3",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "세 번째 알림",
        data: {},
        isRead: false,
        createdAt: row1Date,
      },
      {
        id: "noti-2",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "두 번째 알림",
        data: {},
        isRead: false,
        createdAt: row2Date,
      },
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "첫 번째 알림",
        data: {},
        isRead: false,
        createdAt: row3Date,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1, size: 2 }, { database });

    expect(result.data).toHaveLength(2);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).not.toBeNull();

    const parsedCursor = JSON.parse(Buffer.from(result.nextCursor as string, "base64").toString("utf-8"));

    expect(parsedCursor).toEqual({
      createdAt: row2Date.toISOString(),
      id: "noti-2",
    });
  });

  it("hasMore가 false면 nextCursor는 null을 반환한다", async () => {
    const createdAt = new Date("2026-04-14T10:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "COMMENT",
        message: "알림",
        data: {},
        isRead: false,
        createdAt,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1, size: 10 }, { database });

    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it("유효하지 않은 size면 기본 페이지 크기 10을 사용한다", async () => {
    const { database, mocks } = createDatabaseMock([]);

    await getSpaceNotifications({ userId: 1, size: 0 }, { database });

    expect(mocks.limit).toHaveBeenCalledWith(11);
  });

  it("size가 최대값을 초과하면 50으로 제한한다", async () => {
    const { database, mocks } = createDatabaseMock([]);

    await getSpaceNotifications({ userId: 1, size: 999 }, { database });

    expect(mocks.limit).toHaveBeenCalledWith(51);
  });

  it("유효하지 않은 cursor가 들어오면 첫 페이지처럼 조회한다", async () => {
    const { database } = createDatabaseMock([]);

    const result = await getSpaceNotifications(
      {
        userId: 1,
        cursor: "invalid-cursor",
      },
      { database },
    );

    expect(result).toEqual({
      data: [],
      nextCursor: null,
      hasMore: false,
    });
  });

  it("숫자/문자열/null이 섞인 data를 올바르게 정규화한다", async () => {
    const createdAt = new Date("2026-04-14T10:00:00.000Z");

    const { database } = createDatabaseMock([
      {
        id: "noti-1",
        teamId: "space-1",
        userId: 1,
        type: "SPACE_POST_CREATED",
        message: "새 게시글이 등록되었습니다.",
        data: {
          meetingId: 10,
          meetingName: "스터디 모임",
          postId: 22,
          postTitle: "공지사항",
          commentId: "33",
          commentAuthorName: "모음집",
          commentContent: "확인 부탁드립니다.",
          spaceSlug: "space-slug",
          image: "https://example.com/image.png",
        },
        isRead: true,
        createdAt,
      },
    ]);

    const result = await getSpaceNotifications({ userId: 1 }, { database });

    expect(result.data[0]?.data).toEqual({
      meetingId: 10,
      meetingName: "스터디 모임",
      postId: "22",
      postTitle: "공지사항",
      commentId: "33",
      commentAuthorName: "모음집",
      commentContent: "확인 부탁드립니다.",
      spaceSlug: "space-slug",
      image: "https://example.com/image.png",
    });
  });
});
