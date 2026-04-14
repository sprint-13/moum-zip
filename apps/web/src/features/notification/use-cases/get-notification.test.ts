import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapNotificationsResponse } from "@/entities/notification/model/mapper";
import { getNotifications } from "./get-notification";
import { getSpaceNotifications } from "./get-space-notification";

vi.mock("@/entities/notification/model/mapper", () => ({
  mapNotificationsResponse: vi.fn(),
}));

vi.mock("./get-space-notification", () => ({
  getSpaceNotifications: vi.fn(),
}));

describe("getNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("로그인하지 않은 사용자는 외부 알림만 반환한다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [
        {
          id: 1,
          teamId: "100",
          userId: 2,
          type: "COMMENT",
          message: "외부 알림",
          data: {
            postId: "123",
            image: undefined,
          },
          isRead: 0 as never,
          createdAt: "2026-04-14T10:00:00.000Z",
          source: "external",
        },
      ],
      nextCursor: "external-next-cursor",
      hasMore: true,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: null,
    });

    const result = await getNotifications({ size: 10 }, { getAuthApi, getSession });

    expect(getList).toHaveBeenCalledWith({ size: 10 });
    expect(getSpaceNotifications).not.toHaveBeenCalled();

    expect(result.data).toEqual([
      {
        id: 1,
        teamId: "100",
        userId: 2,
        type: "COMMENT",
        message: "외부 알림",
        data: {
          meetingId: undefined,
          meetingName: undefined,
          postId: "123",
          postTitle: undefined,
          commentId: undefined,
          commentAuthorName: undefined,
          commentContent: undefined,
          spaceSlug: undefined,
          image: null,
        },
        isRead: false,
        createdAt: "2026-04-14T10:00:00.000Z",
        source: "external",
      },
    ]);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).not.toBeNull();

    const parsedCursor = JSON.parse(Buffer.from(result.nextCursor as string, "base64").toString("utf-8"));

    expect(parsedCursor).toEqual({
      externalCursor: "external-next-cursor",
      internalCursor: null,
    });
  });

  it("로그인한 사용자는 외부 알림과 내부 알림을 createdAt 내림차순으로 병합한다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [
        {
          id: 1,
          teamId: "team-external",
          userId: 1,
          type: "MEETING_CONFIRMED",
          message: "외부 알림",
          data: {},
          isRead: false,
          createdAt: "2026-04-14T09:00:00.000Z",
          source: "external",
        },
      ],
      nextCursor: "external-next",
      hasMore: true,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: 7,
    });

    vi.mocked(getSpaceNotifications).mockResolvedValue({
      data: [
        {
          id: "internal-1",
          teamId: "space-1",
          userId: 7,
          type: "COMMENT",
          message: "내부 알림",
          data: {
            postId: "post-1",
          },
          isRead: true,
          createdAt: new Date("2026-04-14T10:00:00.000Z") as never,
          source: "internal",
        },
      ],
      nextCursor: "internal-next",
      hasMore: false,
    });

    const result = await getNotifications({ size: 10 }, { getAuthApi, getSession });

    expect(getSpaceNotifications).toHaveBeenCalledWith({
      userId: 7,
      cursor: undefined,
      size: 10,
      isRead: undefined,
    });

    expect(result.data).toEqual([
      {
        id: "internal-1",
        teamId: "space-1",
        userId: 7,
        type: "COMMENT",
        message: "내부 알림",
        data: {
          meetingId: undefined,
          meetingName: undefined,
          postId: "post-1",
          postTitle: undefined,
          commentId: undefined,
          commentAuthorName: undefined,
          commentContent: undefined,
          spaceSlug: undefined,
          image: null,
        },
        isRead: true,
        createdAt: null,
        source: "internal",
      },
      {
        id: 1,
        teamId: "team-external",
        userId: 1,
        type: "MEETING_CONFIRMED",
        message: "외부 알림",
        data: {
          meetingId: undefined,
          meetingName: undefined,
          postId: undefined,
          postTitle: undefined,
          commentId: undefined,
          commentAuthorName: undefined,
          commentContent: undefined,
          spaceSlug: undefined,
          image: null,
        },
        isRead: false,
        createdAt: "2026-04-14T09:00:00.000Z",
        source: "external",
      },
    ]);

    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).not.toBeNull();

    const parsedCursor = JSON.parse(Buffer.from(result.nextCursor as string, "base64").toString("utf-8"));

    expect(parsedCursor).toEqual({
      externalCursor: "external-next",
      internalCursor: "internal-next",
    });
  });

  it("병합 후 size만큼만 잘라서 반환한다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [
        {
          id: 1,
          teamId: "external-team",
          userId: 1,
          type: "COMMENT",
          message: "외부 알림 1",
          data: {},
          isRead: false,
          createdAt: "2026-04-14T10:00:00.000Z",
          source: "external",
        },
        {
          id: 2,
          teamId: "external-team",
          userId: 1,
          type: "COMMENT",
          message: "외부 알림 2",
          data: {},
          isRead: false,
          createdAt: "2026-04-14T08:00:00.000Z",
          source: "external",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: 7,
    });

    vi.mocked(getSpaceNotifications).mockResolvedValue({
      data: [
        {
          id: "internal-1",
          teamId: "space-1",
          userId: 7,
          type: "COMMENT",
          message: "내부 알림 1",
          data: {},
          isRead: false,
          createdAt: "2026-04-14T09:00:00.000Z",
          source: "internal",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });

    const result = await getNotifications({ size: 2 }, { getAuthApi, getSession });

    expect(result.data).toHaveLength(2);
    expect(result.data.map((item) => item.message)).toEqual(["외부 알림 1", "내부 알림 1"]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it("병합 커서를 파싱해 외부/내부 커서를 각각 전달한다", async () => {
    const mergedCursor = Buffer.from(
      JSON.stringify({
        externalCursor: "external-cursor",
        internalCursor: "internal-cursor",
      }),
      "utf-8",
    ).toString("base64");

    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: 3,
    });

    vi.mocked(getSpaceNotifications).mockResolvedValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    await getNotifications(
      {
        cursor: mergedCursor,
        size: 5,
        isRead: true,
      },
      { getAuthApi, getSession },
    );

    expect(getList).toHaveBeenCalledWith({
      isRead: "true",
      cursor: "external-cursor",
      size: 5,
    });

    expect(getSpaceNotifications).toHaveBeenCalledWith({
      userId: 3,
      cursor: "internal-cursor",
      size: 5,
      isRead: true,
    });
  });

  it("유효하지 않은 커서면 첫 페이지처럼 조회한다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: 3,
    });

    vi.mocked(getSpaceNotifications).mockResolvedValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    await getNotifications(
      {
        cursor: "invalid-cursor",
        size: 5,
      },
      { getAuthApi, getSession },
    );

    expect(getList).toHaveBeenCalledWith({
      size: 5,
    });

    expect(getSpaceNotifications).toHaveBeenCalledWith({
      userId: 3,
      cursor: undefined,
      size: 5,
      isRead: undefined,
    });
  });

  it("isRead가 false여도 외부 API에는 문자열 false로 전달한다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: null,
    });

    await getNotifications(
      {
        isRead: false,
        size: 10,
      },
      { getAuthApi, getSession },
    );

    expect(getList).toHaveBeenCalledWith({
      isRead: "false",
      size: 10,
    });
  });

  it("createdAt이 없는 알림은 정렬 우선순위가 가장 낮다", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: {
        content: [],
      },
    });

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        getList,
      },
    });

    vi.mocked(mapNotificationsResponse).mockReturnValue({
      data: [
        {
          id: 1,
          teamId: "external-team",
          userId: 1,
          type: "COMMENT",
          message: "createdAt 없는 외부 알림",
          data: {},
          isRead: false,
          createdAt: null,
          source: "external",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });

    const getSession = vi.fn().mockResolvedValue({
      userId: 3,
    });

    vi.mocked(getSpaceNotifications).mockResolvedValue({
      data: [
        {
          id: "internal-1",
          teamId: "space-1",
          userId: 3,
          type: "COMMENT",
          message: "시간 있는 내부 알림",
          data: {},
          isRead: false,
          createdAt: "2026-04-14T10:00:00.000Z",
          source: "internal",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });

    const result = await getNotifications({ size: 10 }, { getAuthApi, getSession });

    expect(result.data.map((item) => item.message)).toEqual(["시간 있는 내부 알림", "createdAt 없는 외부 알림"]);
  });
});
