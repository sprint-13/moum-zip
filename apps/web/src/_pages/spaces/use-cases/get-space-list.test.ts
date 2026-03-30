import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSpaceListRemote } from "./get-space-list";

const mockGetJoined = vi.fn();

vi.mock("@/shared/api/server", () => ({
  getApi: vi.fn(),
}));

vi.mock("@/entities/spaces/queries", () => ({
  spaceQueries: {
    findByMeetingIds: vi.fn(),
  },
}));

vi.mock("./get-joined-space-infos", () => ({
  getJoinedSpaceInfosUseCase: vi.fn(),
}));

import { spaceQueries } from "@/entities/spaces/queries";
import { getApi } from "@/shared/api/server";
import { getJoinedSpaceInfosUseCase } from "./get-joined-space-infos";

const mockGetApiClient = vi.mocked(getApi);
const mockFindByMeetingIds = vi.mocked(spaceQueries.findByMeetingIds);
const mockGetJoinedSpaceInfos = vi.mocked(getJoinedSpaceInfosUseCase);

const mockSpaceInfo = {
  spaceId: "space-1",
  name: "테스트 스페이스",
  image: null,
  status: "ongoing" as const,
  slug: "slug-1",
  capacity: 10,
  type: "study" as const,
  location: "서울",
  themeColor: "#FF0000",
  startDate: "2026-03-26T00:00:00.000Z",
  modules: ["bulletin"],
};

const mockJoinedMeetingList = {
  data: [{ id: 1 }, { id: 2 }],
  nextCursor: null,
  hasMore: false,
};

function setupAuthApi(getJoinedResponse: object = { data: mockJoinedMeetingList }) {
  mockGetApiClient.mockResolvedValue({
    meetings: {
      getJoined: mockGetJoined.mockResolvedValue(getJoinedResponse),
    },
  } as unknown as Awaited<ReturnType<typeof getApi>>);
}

describe("getSpaceListRemote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindByMeetingIds.mockResolvedValue([]);
    mockGetJoinedSpaceInfos.mockResolvedValue([]);
  });

  it("스페이스 목록을 반환한다", async () => {
    setupAuthApi();
    mockGetJoinedSpaceInfos.mockResolvedValue([mockSpaceInfo]);

    const result = await getSpaceListRemote();

    expect(result.data).toEqual([mockSpaceInfo]);
    expect(result.nextCursor).toBeNull();
    expect(result.hasMore).toBe(false);
  });

  it("cursor 없이 호출하면 getJoined에 cursor가 전달되지 않는다", async () => {
    setupAuthApi();

    await getSpaceListRemote();

    expect(mockGetJoined).toHaveBeenCalledWith({ cursor: undefined, size: 10 });
  });

  it("cursor를 전달하면 getJoined에 cursor가 전달된다", async () => {
    setupAuthApi();

    await getSpaceListRemote("cursor-abc");

    expect(mockGetJoined).toHaveBeenCalledWith({ cursor: "cursor-abc", size: 10 });
  });

  it("hasMore가 true이고 nextCursor가 있으면 그대로 반환한다", async () => {
    setupAuthApi({
      data: { data: [{ id: 1 }], nextCursor: "next-cursor-xyz", hasMore: true },
    });

    const result = await getSpaceListRemote();

    expect(result.nextCursor).toBe("next-cursor-xyz");
    expect(result.hasMore).toBe(true);
  });

  it("meetingId 목록으로 spaceQueries.findByMeetingIds를 호출한다", async () => {
    setupAuthApi({
      data: { data: [{ id: 10 }, { id: 20 }], nextCursor: null, hasMore: false },
    });

    await getSpaceListRemote();

    expect(mockFindByMeetingIds).toHaveBeenCalledWith([10, 20]);
  });

  it("getApi가 실패하면 해당 에러를 그대로 던진다", async () => {
    mockGetApiClient.mockRejectedValue(new Error("no token"));

    await expect(getSpaceListRemote()).rejects.toThrow("no token");
  });

  it("API가 401을 응답하면 'Unauthorized' 에러를 던진다", async () => {
    mockGetApiClient.mockResolvedValue({
      meetings: {
        getJoined: mockGetJoined.mockRejectedValue({ status: 401 }),
      },
    } as unknown as Awaited<ReturnType<typeof getApi>>);

    await expect(getSpaceListRemote()).rejects.toThrow("Unauthorized");
  });

  it("API가 그 외 에러를 응답하면 'Failed to fetch meetings' 에러를 던진다", async () => {
    mockGetApiClient.mockResolvedValue({
      meetings: {
        getJoined: mockGetJoined.mockRejectedValue({ status: 500 }),
      },
    } as unknown as Awaited<ReturnType<typeof getApi>>);

    await expect(getSpaceListRemote()).rejects.toThrow("Failed to fetch meetings");
  });
});
