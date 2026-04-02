import { afterEach, describe, expect, it, vi } from "vitest";

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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getSearchResults", () => {
  describe("GET /meetings", () => {
    it("meetings 응답을 검색 결과 아이템으로 매핑한다", async () => {
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 24,
              teamId: "team-1",
              name: "Study Group",
              type: "스터디",
              region: "online",
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
              isFavorited: true,
              updatedAt: null,
              host: {
                id: 1,
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      const result = await getSearchResults({}, { meetingsApi: mockMeetingsApi });

      expect(mockMeetingsApi.getList).toHaveBeenCalledWith(
        {
          cursor: undefined,
          region: undefined,
          size: 6,
          sortBy: undefined,
          sortOrder: undefined,
          type: undefined,
        },
        { cache: "no-store" },
      );
      expect(result.items).toEqual([
        {
          address: null,
          capacity: 10,
          confirmedAt: null,
          dateTime: null,
          description: null,
          id: "24",
          image: null,
          isLiked: true,
          location: "online",
          participantCount: 4,
          region: "online",
          registrationEnd: "2026-03-25T12:00:00.000Z",
          slug: "",
          title: "Study Group",
          type: "study",
        },
      ]);
    });

    it("카테고리를 외부 API type 파라미터로 전달한다", async () => {
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 2,
              teamId: "team-1",
              name: "Project Group",
              type: "프로젝트",
              region: "offline",
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
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      const result = await getSearchResults({ categoryId: "project" }, { meetingsApi: mockMeetingsApi });

      expect(mockMeetingsApi.getList).toHaveBeenCalledWith(
        {
          cursor: undefined,
          region: undefined,
          size: 6,
          sortBy: undefined,
          sortOrder: undefined,
          type: "프로젝트",
        },
        { cache: "no-store" },
      );
      expect(result.items[0]).toMatchObject({
        location: "offline",
        slug: "",
        type: "project",
      });
    });

    it("날짜 정렬 파라미터를 외부 meetings API에 전달한다", async () => {
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(createMeetingsListResponse([])),
      };

      await getSearchResults({ dateSortId: "latest" }, { meetingsApi: mockMeetingsApi });

      expect(mockMeetingsApi.getList).toHaveBeenCalledWith(
        {
          cursor: undefined,
          region: undefined,
          size: 6,
          sortBy: "dateTime",
          sortOrder: "desc",
          type: undefined,
        },
        { cache: "no-store" },
      );
    });

    it("meetings region 값으로 위치를 필터링한다", async () => {
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 1,
              teamId: "team-1",
              name: "Online Study",
              type: "스터디",
              region: "online",
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
                image: null,
                name: "Host",
              },
            },
            {
              id: 2,
              teamId: "team-1",
              name: "Offline Study",
              type: "스터디",
              region: "offline",
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
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      const result = await getSearchResults({ locationId: "offline" }, { meetingsApi: mockMeetingsApi });

      expect(mockMeetingsApi.getList).toHaveBeenCalledWith(
        {
          cursor: undefined,
          region: "offline",
          size: 6,
          sortBy: undefined,
          sortOrder: undefined,
          type: undefined,
        },
        { cache: "no-store" },
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({
        id: "2",
        location: "offline",
      });
    });

    it("meetings region 값이 online, offline이 아니면 offline으로 fallback한다", async () => {
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 3,
              teamId: "team-1",
              name: "Gangnam Offline",
              type: "프로젝트",
              region: "서울시 강남구",
              address: "서울시 강남구",
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
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      const result = await getSearchResults({ locationId: "offline" }, { meetingsApi: mockMeetingsApi });

      expect(result.items).toEqual([
        expect.objectContaining({
          id: "3",
          location: "offline",
          region: "서울시 강남구",
        }),
      ]);
    });
  });

  describe("인증된 GET /meetings 응답 경고", () => {
    it("인증 요청인데 isFavorited가 없으면 경고를 남긴다", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 866,
              teamId: "team-1",
              name: "Project Group",
              type: "프로젝트",
              region: "online",
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
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      await getSearchResults({}, { isAuthenticatedRequest: true, meetingsApi: mockMeetingsApi });

      expect(warnSpy).toHaveBeenCalledWith("[search] 인증된 모임 응답에 isFavorited 값이 없습니다", {
        meetingIds: [866],
      });
    });

    it("인증 요청인데 isFavorited가 null이어도 경고를 남긴다", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 867,
              teamId: "team-1",
              name: "Project Group",
              type: "프로젝트",
              region: "online",
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
              isFavorited: null,
              updatedAt: null,
              host: {
                id: 1,
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      await getSearchResults({}, { isAuthenticatedRequest: true, meetingsApi: mockMeetingsApi });

      expect(warnSpy).toHaveBeenCalledWith("[search] 인증된 모임 응답에 isFavorited 값이 없습니다", {
        meetingIds: [867],
      });
    });

    it("비로그인 공개 조회에서는 isFavorited가 없어도 경고를 남기지 않는다", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const mockMeetingsApi = {
        getList: vi.fn().mockResolvedValue(
          createMeetingsListResponse([
            {
              id: 866,
              teamId: "team-1",
              name: "Project Group",
              type: "프로젝트",
              region: "online",
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
                image: null,
                name: "Host",
              },
            },
          ]),
        ),
      };

      await getSearchResults({}, { isAuthenticatedRequest: false, meetingsApi: mockMeetingsApi });

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
