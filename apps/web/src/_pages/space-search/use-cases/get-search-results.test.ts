import { describe, expect, it, vi } from "vitest";

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
  it("maps meetings data into search items", async () => {
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

    expect(mockMeetingsApi.getList).toHaveBeenCalledWith({
      cursor: undefined,
      region: undefined,
      size: 6,
      sortBy: undefined,
      sortOrder: undefined,
      type: undefined,
    });
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

  it("passes category as external API type param", async () => {
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

    expect(mockMeetingsApi.getList).toHaveBeenCalledWith({
      cursor: undefined,
      region: undefined,
      size: 6,
      sortBy: undefined,
      sortOrder: undefined,
      type: "프로젝트",
    });
    expect(result.items[0]).toMatchObject({
      location: "offline",
      slug: "",
      type: "project",
    });
  });

  it("passes date sort params to external meetings API", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue(createMeetingsListResponse([])),
    };

    await getSearchResults({ dateSortId: "latest" }, { meetingsApi: mockMeetingsApi });

    expect(mockMeetingsApi.getList).toHaveBeenCalledWith({
      cursor: undefined,
      region: undefined,
      size: 6,
      sortBy: "dateTime",
      sortOrder: "desc",
      type: undefined,
    });
  });

  it("filters location using meetings region values", async () => {
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

    expect(mockMeetingsApi.getList).toHaveBeenCalledWith({
      cursor: undefined,
      region: "offline",
      size: 6,
      sortBy: undefined,
      sortOrder: undefined,
      type: undefined,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: "2",
      location: "offline",
    });
  });
});
