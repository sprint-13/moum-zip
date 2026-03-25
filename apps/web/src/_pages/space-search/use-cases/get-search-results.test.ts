import { describe, expect, it, vi } from "vitest";

import { getSearchResults } from "./get-search-results";

describe("getSearchResults", () => {
  it("maps external meetings with internal space enrichment", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue({
        data: [
          {
            id: 24,
            teamId: "team-1",
            name: "Study Group",
            type: "study",
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
        ],
        hasMore: false,
        nextCursor: null,
      }),
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

  it("falls back when internal spaces are empty", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue({
        data: [
          {
            id: 2,
            teamId: "team-1",
            name: "Project Group",
            type: "project",
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
        ],
        hasMore: false,
        nextCursor: null,
      }),
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

  it("continues even if internal space lookup fails", async () => {
    const mockMeetingsApi = {
      getList: vi.fn().mockResolvedValue({
        data: [
          {
            id: 3,
            teamId: "team-1",
            name: "Study Group",
            type: "study",
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
        ],
        hasMore: false,
        nextCursor: null,
      }),
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
