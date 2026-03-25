import { describe, expect, it, vi } from "vitest";

vi.mock("@/entities/gathering", () => ({
  gatheringQueries: {
    findSpacesByMeetingIds: vi.fn(),
  },
}));

import { getSearchResults } from "./get-search-results";

const createMeetingsListResponse = (
  data: unknown[],
  overrides?: { hasMore?: boolean; nextCursor?: string | null },
) => ({
  data: {
    data,
    hasMore: overrides?.hasMore ?? false,
    nextCursor: overrides?.nextCursor ?? null,
  },
});

describe("getSearchResults", () => {
  it("외부 모임 목록을 내부 스페이스 정보와 함께 매핑한다", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue(
        createMeetingsListResponse([
          {
            id: 24,
            teamId: "team-1",
            name: "Study Group",
            type: "스터디",
            region: "Seongdong-gu",
            address: null,
            latitude: null,
            longitude: null,
            dateTime: null,
            registrationEnd: "2026-03-25T12:00:00.000Z",
            capacity: 10,
            participantCount: 4,
            image: null,
            description: null,
            canceledAt: null,
            confirmedAt: null,
            hostId: 1,
            createdBy: 1,
            createdAt: null,
            updatedAt: null,
            host: {
              id: 1,
              name: "Host",
              image: null,
            },
          },
        ]),
      ),
    };
    const mockQueries = {
      findSpacesByMeetingIds: vi.fn().mockResolvedValue([
        {
          id: "space-1",
          slug: "study-space",
          meetingId: 24,
          location: "online",
          themeColor: "green",
          status: "ongoing",
          modules: [],
          createdAt: null,
        },
      ]),
    };

    const result = await getSearchResults({}, { meetingsApi: mockMeetingsApi, queries: mockQueries });

    expect(mockMeetingsApi.getList).toHaveBeenCalledWith({
      cursor: undefined,
      size: 12,
      type: undefined,
    });
    expect(mockQueries.findSpacesByMeetingIds).toHaveBeenCalledWith([24]);
    expect(result.items).toEqual([
      {
        address: null,
        capacity: 10,
        confirmedAt: null,
        dateTime: null,
        description: null,
        id: "24",
        image: null,
        isLiked: false,
        location: "online",
        participantCount: 4,
        region: "Seongdong-gu",
        registrationEnd: "2026-03-25T12:00:00.000Z",
        slug: "study-space",
        title: "Study Group",
        type: "study",
      },
    ]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it("내부 스페이스 정보가 없으면 기본값으로 대체한다", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue(
        createMeetingsListResponse([
          {
            id: 2,
            teamId: "team-1",
            name: "Project Group",
            type: "프로젝트",
            region: "Gangnam-gu",
            address: "Teheran-ro",
            latitude: 37.5,
            longitude: 127.0,
            dateTime: null,
            registrationEnd: null,
            capacity: 10,
            participantCount: 4,
            image: null,
            description: null,
            canceledAt: null,
            confirmedAt: null,
            hostId: 1,
            createdBy: 1,
            createdAt: null,
            updatedAt: null,
            host: {
              id: 1,
              name: "Host",
              image: null,
            },
          },
        ]),
      ),
    };
    const mockQueries = {
      findSpacesByMeetingIds: vi.fn().mockResolvedValue([]),
    };

    const result = await getSearchResults(
      { categoryId: "project" },
      { meetingsApi: mockMeetingsApi, queries: mockQueries },
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      location: "offline",
      slug: "",
      type: "project",
    });
  });

  it("내부 스페이스 조회에 실패해도 결과를 반환한다", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue(
        createMeetingsListResponse([
          {
            id: 3,
            teamId: "team-1",
            name: "Study Group",
            type: "스터디",
            region: "Mapo-gu",
            address: null,
            latitude: null,
            longitude: null,
            dateTime: null,
            registrationEnd: null,
            capacity: 10,
            participantCount: 4,
            image: null,
            description: null,
            canceledAt: null,
            confirmedAt: null,
            hostId: 1,
            createdBy: 1,
            createdAt: null,
            updatedAt: null,
            host: {
              id: 1,
              name: "Host",
              image: null,
            },
          },
        ]),
      ),
    };
    const mockQueries = {
      findSpacesByMeetingIds: vi.fn().mockRejectedValue(new Error("SPACE_LOOKUP_FAILED")),
    };

    const result = await getSearchResults({}, { meetingsApi: mockMeetingsApi, queries: mockQueries });

    expect(result.items[0]).toMatchObject({
      location: "online",
      slug: "",
    });
  });
});
