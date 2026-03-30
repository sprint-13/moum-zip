import type { MeetingsListData, MeetingWithHost } from "@moum-zip/api/data-contracts";

import type {
  GatheringCategory,
  GatheringLocation,
  SearchResultItem,
  SearchResultsResponse,
} from "@/entities/gathering";
import { getGatheringCategoryRequestType, normalizeGatheringCategory } from "@/entities/gathering";
import { api } from "@/shared/api";

const DEFAULT_SEARCH_SIZE = 6;

type SearchSortBy = "dateTime" | "registrationEnd";
type SearchSortOrder = "asc" | "desc";

interface GetSearchResultsInput {
  categoryId?: "all" | GatheringCategory;
  cursor?: string | null;
  dateSortId?: "default" | "latest" | "oldest";
  deadlineSortId?: "default" | "fast" | "slow";
  locationId?: "all" | GatheringLocation;
  size?: number;
}

interface GetSearchResultsDeps {
  isAuthenticatedRequest?: boolean;
  meetingsApi?: Pick<typeof api.meetings, "getList">;
}

type SearchMeetingWithUserState = Omit<MeetingWithHost, "region"> & {
  region: GatheringLocation;
  isCompleted?: boolean;
  isFavorited?: boolean | null;
  isJoined?: boolean;
};

const normalizeMeetingType = (type: string): GatheringCategory => {
  return normalizeGatheringCategory(type) ?? "project";
};

const resolveSortParams = ({
  dateSortId,
  deadlineSortId,
}: Pick<GetSearchResultsInput, "dateSortId" | "deadlineSortId">): {
  sortBy?: SearchSortBy;
  sortOrder?: SearchSortOrder;
} => {
  if (deadlineSortId === "fast") {
    return {
      sortBy: "registrationEnd",
      sortOrder: "asc",
    };
  }

  if (deadlineSortId === "slow") {
    return {
      sortBy: "registrationEnd",
      sortOrder: "desc",
    };
  }

  if (dateSortId === "latest") {
    return {
      sortBy: "dateTime",
      sortOrder: "desc",
    };
  }

  if (dateSortId === "oldest") {
    return {
      sortBy: "dateTime",
      sortOrder: "asc",
    };
  }

  return {};
};

const mapMeetingToItem = (meeting: SearchMeetingWithUserState): SearchResultItem => {
  return {
    address: meeting.address,
    capacity: meeting.capacity,
    confirmedAt: meeting.confirmedAt,
    dateTime: meeting.dateTime,
    description: meeting.description,
    id: String(meeting.id),
    image: meeting.image,
    isLiked: meeting.isFavorited ?? false,
    location: meeting.region,
    participantCount: meeting.participantCount,
    region: meeting.region,
    registrationEnd: meeting.registrationEnd,
    slug: "",
    title: meeting.name,
    type: normalizeMeetingType(meeting.type),
  };
};

const matchesLocation = (item: SearchResultItem, locationId: GetSearchResultsInput["locationId"]) => {
  if (!locationId || locationId === "all") {
    return true;
  }

  return item.location === locationId;
};

const warnMissingFavoritedField = (meetings: SearchMeetingWithUserState[], isAuthenticatedRequest: boolean) => {
  if (!isAuthenticatedRequest) {
    return;
  }

  const meetingIds = meetings.filter((meeting) => meeting.isFavorited == null).map((meeting) => meeting.id);

  if (meetingIds.length === 0) {
    return;
  }

  console.warn("[search] authenticated meetings response is missing isFavorited", { meetingIds });
};

export const getSearchResults = async (
  {
    categoryId = "all",
    cursor,
    dateSortId = "default",
    deadlineSortId = "default",
    locationId = "all",
    size = DEFAULT_SEARCH_SIZE,
  }: GetSearchResultsInput = {},
  { isAuthenticatedRequest = false, meetingsApi = api.meetings }: GetSearchResultsDeps = {},
): Promise<SearchResultsResponse> => {
  const { sortBy, sortOrder } = resolveSortParams({ dateSortId, deadlineSortId });
  const timerLabel = `[search] GET /meetings category=${categoryId} location=${locationId} cursor=${cursor ?? "none"} size=${size}`;
  console.time(timerLabel);
  const response = await meetingsApi
    .getList(
      {
        cursor: cursor ?? undefined,
        region: locationId === "all" ? undefined : locationId,
        size,
        sortBy,
        sortOrder,
        type: categoryId === "all" ? undefined : getGatheringCategoryRequestType(categoryId),
      },
      { cache: "no-store" },
    )
    .finally(() => {
      console.timeEnd(timerLabel);
    });
  const searchResults = response.data as MeetingsListData;
  const meetings = searchResults.data as SearchMeetingWithUserState[];
  warnMissingFavoritedField(meetings, isAuthenticatedRequest);

  const items = meetings
    .map((meeting) => mapMeetingToItem(meeting))
    .filter((item) => (categoryId === "all" ? true : item.type === categoryId))
    .filter((item) => matchesLocation(item, locationId));

  return {
    hasMore: searchResults.hasMore,
    items,
    nextCursor: searchResults.nextCursor,
  };
};
