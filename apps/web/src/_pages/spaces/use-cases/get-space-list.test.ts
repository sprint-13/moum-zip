import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSpaceListUsecase } from "./get-space-list";

const mockGetJoined = vi.fn();

vi.mock("@/shared/api/server", () => ({
  getApi: vi.fn(),
  isAuth: vi.fn(),
}));

vi.mock("@/features/space/queries", () => ({
  spaceAndMemberJoinQueries: {
    getJoinedInformation: vi.fn(),
  },
}));

vi.mock("@/features/space/mapper", () => ({
  mapSpaceInfoList: vi.fn(),
}));

import { mapSpaceInfoList } from "@/features/space/mapper";
import { spaceAndMemberJoinQueries } from "@/features/space/queries";
import { getApi, isAuth } from "@/shared/api/server";

const mockGetApiClient = vi.mocked(getApi);
const mockIsAuth = vi.mocked(isAuth);
const mockGetJoinedInformation = vi.mocked(spaceAndMemberJoinQueries.getJoinedInformation);
const mockMapSpaceInfoList = vi.mocked(mapSpaceInfoList);

const mockSpaceInfo = {
  spaceId: "space-1",
  name: "테스트 스페이스",
  image: null,
  status: "ongoing" as const,
  slug: "slug-1",
  capacity: 10,
  type: "study" as const,
  location: "online" as const,
  themeColor: "#FF0000",
  startDate: "2026-03-26T00:00:00.000Z",
  modules: ["bulletin"],
  isApproved: true,
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

describe("getSpaceListUsecase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuth.mockResolvedValue({ authenticated: true, userId: 1 });
    mockGetJoinedInformation.mockResolvedValue([]);
    mockMapSpaceInfoList.mockReturnValue([]);
  });

  it("스페이스 목록을 반환한다", async () => {
    setupAuthApi();
    mockMapSpaceInfoList.mockReturnValue([mockSpaceInfo]);

    const result = await getSpaceListUsecase();

    expect(result.data).toEqual([mockSpaceInfo]);
    expect(result.nextCursor).toBeNull();
    expect(result.hasMore).toBe(false);
  });

  it("cursor 없이 호출하면 getJoined에 cursor가 전달되지 않는다", async () => {
    setupAuthApi();

    await getSpaceListUsecase();

    expect(mockGetJoined).toHaveBeenCalledWith({ cursor: undefined, size: 10 });
  });

  it("cursor를 전달하면 getJoined에 cursor가 전달된다", async () => {
    setupAuthApi();

    await getSpaceListUsecase("cursor-abc");

    expect(mockGetJoined).toHaveBeenCalledWith({ cursor: "cursor-abc", size: 10 });
  });

  it("hasMore가 true이고 nextCursor가 있으면 그대로 반환한다", async () => {
    setupAuthApi({
      data: { data: [{ id: 1 }], nextCursor: "next-cursor-xyz", hasMore: true },
    });

    const result = await getSpaceListUsecase();

    expect(result.nextCursor).toBe("next-cursor-xyz");
    expect(result.hasMore).toBe(true);
  });

  it("meetingId 목록으로 getJoinedInformation을 호출한다", async () => {
    setupAuthApi({
      data: { data: [{ id: 10 }, { id: 20 }], nextCursor: null, hasMore: false },
    });

    await getSpaceListUsecase();

    expect(mockGetJoinedInformation).toHaveBeenCalledWith([10, 20], 1);
  });

  it("meetingId가 없으면 getJoinedInformation을 호출하지 않고 빈 배열을 반환한다", async () => {
    setupAuthApi({
      data: { data: [], nextCursor: null, hasMore: false },
    });

    const result = await getSpaceListUsecase();

    expect(mockGetJoinedInformation).not.toHaveBeenCalled();
    expect(result.data).toEqual([]);
  });

  it("userId가 null이면 UNAUTHENTICATED 에러를 던진다", async () => {
    mockIsAuth.mockResolvedValue({ authenticated: false, userId: null });
    setupAuthApi();

    await expect(getSpaceListUsecase()).rejects.toThrow("UNAUTHENTICATED");
  });

  it("getApi가 실패하면 해당 에러를 그대로 던진다", async () => {
    mockGetApiClient.mockRejectedValue(new Error("no token"));

    await expect(getSpaceListUsecase()).rejects.toThrow("no token");
  });

  it("API가 401을 응답하면 UNAUTHENTICATED 에러를 던진다", async () => {
    mockGetApiClient.mockResolvedValue({
      meetings: {
        getJoined: mockGetJoined.mockRejectedValue({ status: 401 }),
      },
    } as unknown as Awaited<ReturnType<typeof getApi>>);

    await expect(getSpaceListUsecase()).rejects.toThrow("UNAUTHENTICATED");
  });

  it("API가 그 외 에러를 응답하면 'Failed to fetch meetings' 에러를 던진다", async () => {
    mockGetApiClient.mockResolvedValue({
      meetings: {
        getJoined: mockGetJoined.mockRejectedValue({ status: 500 }),
      },
    } as unknown as Awaited<ReturnType<typeof getApi>>);

    await expect(getSpaceListUsecase()).rejects.toThrow("Failed to fetch meetings");
  });
});
