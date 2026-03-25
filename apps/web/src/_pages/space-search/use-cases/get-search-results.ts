import type { MeetingsListData, MeetingWithHost } from "@moum-zip/api/data-contracts";

import type {
  GatheringCategory,
  GatheringLocation,
  SearchResultItem,
  SearchResultsResponse,
} from "@/entities/gathering";
import { gatheringQueries } from "@/entities/gathering";
import { api } from "@/shared/api";

const DEFAULT_SEARCH_SIZE = 12;

interface GetSearchResultsInput {
  categoryId?: "all" | GatheringCategory;
  cursor?: string | null;
  size?: number;
}

interface GetSearchResultsDeps {
  meetingsApi?: Pick<typeof api.meetings, "getList">;
  queries?: Pick<typeof gatheringQueries, "findSpacesByMeetingIds">;
}

const normalizeMeetingType = (type: string): GatheringCategory => {
  const normalizedType = type.trim().toLowerCase();

  return normalizedType === "스터디" ? "study" : "project";
};

const inferLocation = (meeting: MeetingWithHost): GatheringLocation => {
  if (meeting.address || meeting.latitude !== null || meeting.longitude !== null) {
    return "offline";
  }

  return "online";
};

const mapMeetingToItem = (
  meeting: MeetingWithHost,
  spaceByMeetingId: Map<number, Awaited<ReturnType<typeof gatheringQueries.findSpacesByMeetingIds>>[number]>,
): SearchResultItem => {
  const space = spaceByMeetingId.get(meeting.id);

  return {
    address: meeting.address,
    capacity: meeting.capacity,
    confirmedAt: meeting.confirmedAt,
    dateTime: meeting.dateTime,
    description: meeting.description,
    id: String(meeting.id),
    image: meeting.image,
    isLiked: false,
    location: space?.location ?? inferLocation(meeting),
    participantCount: meeting.participantCount,
    region: meeting.region,
    registrationEnd: meeting.registrationEnd,
    slug: space?.slug ?? "",
    title: meeting.name,
    type: normalizeMeetingType(meeting.type),
  };
};

const createSpaceByMeetingIdMap = async (
  meetings: MeetingWithHost[],
  queries: Pick<typeof gatheringQueries, "findSpacesByMeetingIds">,
) => {
  try {
    const meetingIds = meetings.map(({ id }) => id);
    const spaces = await queries.findSpacesByMeetingIds(meetingIds);

    return new Map(spaces.map((space) => [space.meetingId, space]));
  } catch {
    return new Map<number, Awaited<ReturnType<typeof gatheringQueries.findSpacesByMeetingIds>>[number]>();
  }
};

export const getSearchResults = async (
  { categoryId = "all", cursor, size = DEFAULT_SEARCH_SIZE }: GetSearchResultsInput = {},
  { meetingsApi = api.meetings, queries = gatheringQueries }: GetSearchResultsDeps = {},
): Promise<SearchResultsResponse> => {
  const response = await meetingsApi.getList({
    cursor: cursor ?? undefined,
    size,
    type: categoryId === "all" ? undefined : categoryId,
  });
  const searchResults = response.data as MeetingsListData;

  const spaceByMeetingId = await createSpaceByMeetingIdMap(searchResults.data, queries);
  const items = searchResults.data
    .map((meeting) => mapMeetingToItem(meeting, spaceByMeetingId))
    .filter((item) => (categoryId === "all" ? true : item.type === categoryId));

  return {
    hasMore: searchResults.hasMore,
    items,
    nextCursor: searchResults.nextCursor,
  };
};
