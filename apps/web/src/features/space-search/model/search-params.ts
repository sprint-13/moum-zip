import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_INITIAL_QUERY_STATE } from "./constants";
import type {
  SpaceSearchCategoryId,
  SpaceSearchDateSortId,
  SpaceSearchDeadlineSortId,
  SpaceSearchLocationId,
  SpaceSearchQueryState,
} from "./types";

export type SearchResultsCategoryId = "all" | "study" | "project";

export interface SearchResultsQueryState {
  categoryId: SearchResultsCategoryId;
  dateSortId: SpaceSearchDateSortId;
  deadlineSortId: SpaceSearchDeadlineSortId;
  locationId: SpaceSearchLocationId;
}

type SearchParamRecord = Record<string, string | string[] | undefined>;
type SearchParamSource = SearchParamRecord | { get(name: string): string | null } | undefined;

const categoryIds = new Set<SpaceSearchCategoryId>(SPACE_SEARCH_CATEGORIES.map(({ id }) => id));
const dateSortIds = new Set<SpaceSearchDateSortId>(["default", "latest", "oldest"]);
const deadlineSortIds = new Set<SpaceSearchDeadlineSortId>(["default", "fast", "slow"]);
const locationIds = new Set<SpaceSearchLocationId>(["all", "online", "offline"]);

const isSearchParamGetter = (value: SearchParamSource): value is { get(name: string): string | null } => {
  return typeof value === "object" && value !== null && "get" in value && typeof value.get === "function";
};

const getSearchParamValue = (searchParams: SearchParamSource, key: string) => {
  if (!searchParams) {
    return null;
  }

  if (isSearchParamGetter(searchParams)) {
    return searchParams.get(key);
  }

  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

const isSpaceSearchCategoryId = (value: string): value is SpaceSearchCategoryId => {
  return categoryIds.has(value as SpaceSearchCategoryId);
};

const isSpaceSearchDateSortId = (value: string): value is SpaceSearchDateSortId => {
  return dateSortIds.has(value as SpaceSearchDateSortId);
};

const isSpaceSearchDeadlineSortId = (value: string): value is SpaceSearchDeadlineSortId => {
  return deadlineSortIds.has(value as SpaceSearchDeadlineSortId);
};

const isSpaceSearchLocationId = (value: string): value is SpaceSearchLocationId => {
  return locationIds.has(value as SpaceSearchLocationId);
};

export const normalizeSearchCategoryId = (categoryId: SpaceSearchQueryState["categoryId"]): SearchResultsCategoryId => {
  if (categoryId === "study" || categoryId === "project") {
    return categoryId;
  }

  return "all";
};

export const normalizeSearchQueryState = (queryState: SpaceSearchQueryState): SearchResultsQueryState => {
  return {
    categoryId: normalizeSearchCategoryId(queryState.categoryId),
    dateSortId: queryState.dateSortId,
    deadlineSortId: queryState.deadlineSortId,
    locationId: queryState.locationId,
  };
};

export const parseSpaceSearchQueryState = (searchParams: SearchParamSource): SpaceSearchQueryState => {
  const categoryId = getSearchParamValue(searchParams, "category");
  const dateSortId = getSearchParamValue(searchParams, "dateSort");
  const deadlineSortId = getSearchParamValue(searchParams, "deadlineSort");
  const locationId = getSearchParamValue(searchParams, "location");

  return {
    categoryId:
      categoryId && isSpaceSearchCategoryId(categoryId) ? categoryId : SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId,
    dateSortId:
      dateSortId && isSpaceSearchDateSortId(dateSortId) ? dateSortId : SPACE_SEARCH_INITIAL_QUERY_STATE.dateSortId,
    deadlineSortId:
      deadlineSortId && isSpaceSearchDeadlineSortId(deadlineSortId)
        ? deadlineSortId
        : SPACE_SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
    locationId:
      locationId && isSpaceSearchLocationId(locationId) ? locationId : SPACE_SEARCH_INITIAL_QUERY_STATE.locationId,
  };
};

export const buildSpaceSearchHref = (pathname: string, queryState: SpaceSearchQueryState) => {
  const searchParams = new URLSearchParams();
  const normalizedQueryState = normalizeSearchQueryState(queryState);

  if (normalizedQueryState.categoryId !== SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId) {
    searchParams.set("category", normalizedQueryState.categoryId);
  }

  if (normalizedQueryState.dateSortId !== SPACE_SEARCH_INITIAL_QUERY_STATE.dateSortId) {
    searchParams.set("dateSort", normalizedQueryState.dateSortId);
  }

  if (normalizedQueryState.locationId !== SPACE_SEARCH_INITIAL_QUERY_STATE.locationId) {
    searchParams.set("location", normalizedQueryState.locationId);
  }

  if (normalizedQueryState.deadlineSortId !== SPACE_SEARCH_INITIAL_QUERY_STATE.deadlineSortId) {
    searchParams.set("deadlineSort", normalizedQueryState.deadlineSortId);
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const createSpaceSearchStateKey = (queryState: SpaceSearchQueryState) => {
  const normalizedQueryState = normalizeSearchQueryState(queryState);

  return [
    normalizedQueryState.categoryId,
    normalizedQueryState.dateSortId,
    normalizedQueryState.locationId,
    normalizedQueryState.deadlineSortId,
  ].join(":");
};
