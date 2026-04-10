import type { MeetingWithHost } from "@moum-zip/api/data-contracts";

import type {
  GatheringCategory,
  GatheringLocation,
  SearchResultItem,
  SearchResultsResponse,
} from "@/entities/gathering";
import { getGatheringCategoryRequestType } from "@/entities/gathering";
import { api } from "@/shared/api";

import { normalizeMeetingRegion, normalizeMeetingType, resolveSortParams } from "../lib/search-results-rules";

const DEFAULT_SEARCH_SIZE = 6;

interface GetSearchResultsInput {
  categoryId?: "all" | GatheringCategory;
  cursor?: string | null;
  dateSortId?: "default" | "latest" | "oldest";
  deadlineSortId?: "default" | "fast" | "slow";
  keyword?: string;
  locationId?: "all" | GatheringLocation;
  size?: number;
}

interface GetSearchResultsDeps {
  isAuthenticatedRequest?: boolean;
  meetingsApi?: Pick<typeof api.meetings, "getList">;
}

type SearchMeetingWithUserState = MeetingWithHost & {
  isCompleted?: boolean;
  isFavorited?: boolean | null;
  isJoined?: boolean;
};

const createSearchRequestParams = ({
  categoryId,
  cursor,
  dateSortId,
  deadlineSortId,
  keyword,
  locationId,
  size,
}: GetSearchResultsInput) => {
  const { sortBy, sortOrder } = resolveSortParams({ dateSortId, deadlineSortId });

  return {
    cursor: cursor ?? undefined,
    keyword: keyword || undefined,
    region: locationId === "all" ? undefined : locationId,
    size,
    sortBy,
    sortOrder,
    type: !categoryId || categoryId === "all" ? undefined : getGatheringCategoryRequestType(categoryId),
  };
};

const mapSearchMeetingToItem = (meeting: SearchMeetingWithUserState): SearchResultItem | null => {
  const type = normalizeMeetingType(meeting.type);

  if (!type) {
    return null;
  }

  return {
    address: meeting.address,
    capacity: meeting.capacity,
    confirmedAt: meeting.confirmedAt,
    dateTime: meeting.dateTime,
    description: meeting.description,
    id: String(meeting.id),
    image: meeting.image,
    isLiked: meeting.isFavorited ?? false,
    location: normalizeMeetingRegion(meeting.region),
    participantCount: meeting.participantCount,
    region: meeting.region,
    registrationEnd: meeting.registrationEnd,
    slug: "",
    title: meeting.name,
    type,
  };
};

const createSearchResultItems = (
  meetings: SearchMeetingWithUserState[],
  { categoryId, locationId }: Pick<GetSearchResultsInput, "categoryId" | "locationId">,
) => {
  return meetings
    .map(mapSearchMeetingToItem)
    .filter((item): item is SearchResultItem => item !== null)
    .filter((item) => (categoryId === "all" ? true : item.type === categoryId))
    .filter((item) => (!locationId || locationId === "all" ? true : item.location === locationId));
};

const warnMissingFavoritedField = (meetings: SearchMeetingWithUserState[], isAuthenticatedRequest: boolean) => {
  if (!isAuthenticatedRequest) {
    return;
  }

  const meetingIds = meetings.filter((meeting) => meeting.isFavorited == null).map((meeting) => meeting.id);

  if (meetingIds.length === 0) {
    return;
  }

  console.warn("[search] 인증된 스페이스 응답에 isFavorited 값이 없습니다", { meetingIds });
};

export const getSearchResults = async (
  {
    categoryId = "all",
    cursor,
    dateSortId = "default",
    deadlineSortId = "default",
    keyword = "",
    locationId = "all",
    size = DEFAULT_SEARCH_SIZE,
  }: GetSearchResultsInput = {},
  { isAuthenticatedRequest = false, meetingsApi = api.meetings }: GetSearchResultsDeps = {},
): Promise<SearchResultsResponse> => {
  const requestParams = createSearchRequestParams({
    categoryId,
    cursor,
    dateSortId,
    deadlineSortId,
    keyword,
    locationId,
    size,
  });
  const response = await meetingsApi.getList(
    requestParams,
    // { cache: "no-store" },
  );
  const searchResults = response.data;
  const meetings: SearchMeetingWithUserState[] = searchResults.data;

  warnMissingFavoritedField(meetings, isAuthenticatedRequest);

  return {
    hasMore: searchResults.hasMore,
    items: createSearchResultItems(meetings, { categoryId, locationId }),
    nextCursor: searchResults.nextCursor,
  };
};
