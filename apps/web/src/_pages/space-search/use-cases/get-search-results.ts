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
  meetingsApi?: Pick<typeof api.meetings, "getList">;
}

type SearchMeetingWithUserState = MeetingWithHost & {
  isCompleted?: boolean;
  isFavorited?: boolean;
  isJoined?: boolean;
};

const normalizeMeetingType = (type: string): GatheringCategory => {
  return normalizeGatheringCategory(type) ?? "project";
};

const normalizeMeetingLocation = (region: string): GatheringLocation | null => {
  const normalizedRegion = region.trim().toLowerCase();

  if (normalizedRegion === "online") {
    return "online";
  }

  if (normalizedRegion === "offline") {
    return "offline";
  }

  return null;
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
    isLiked: Boolean(meeting.isFavorited),
    location: normalizeMeetingLocation(meeting.region) ?? "online",
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

export const getSearchResults = async (
  {
    categoryId = "all",
    cursor,
    dateSortId = "default",
    deadlineSortId = "default",
    locationId = "all",
    size = DEFAULT_SEARCH_SIZE,
  }: GetSearchResultsInput = {},
  { meetingsApi = api.meetings }: GetSearchResultsDeps = {},
): Promise<SearchResultsResponse> => {
  const { sortBy, sortOrder } = resolveSortParams({ dateSortId, deadlineSortId });
  const response = await meetingsApi.getList(
    {
      cursor: cursor ?? undefined,
      region: locationId === "all" ? undefined : locationId,
      size,
      sortBy,
      sortOrder,
      type: categoryId === "all" ? undefined : getGatheringCategoryRequestType(categoryId),
    },
    { cache: "no-store" },
  );
  const searchResults = response.data as MeetingsListData;
  const meetings = searchResults.data as SearchMeetingWithUserState[];
  console.log(
    "[search] meetings favorite state",
    JSON.stringify(meetings.map(({ id, isFavorited }) => ({ id, isFavorited }))),
  );

  const items = meetings
    .map((meeting) => mapMeetingToItem(meeting))
    .filter((item) => (categoryId === "all" ? true : item.type === categoryId))
    .filter((item) => matchesLocation(item, locationId));

  console.log("[search] mapped like state", JSON.stringify(items.map(({ id, isLiked }) => ({ id, isLiked }))));

  return {
    hasMore: searchResults.hasMore,
    items,
    nextCursor: searchResults.nextCursor,
  };
};
