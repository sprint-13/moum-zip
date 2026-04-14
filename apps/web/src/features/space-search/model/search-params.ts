import { SEARCH_CATEGORIES, SEARCH_INITIAL_QUERY_STATE } from "./constants";
import type {
  SearchCategoryId,
  SearchDateSortId,
  SearchDeadlineSortId,
  SearchLocationId,
  SearchQueryState,
  SearchRequestCategoryId,
  SearchRequestQueryState,
} from "./types";

type SearchParamRecord = Record<string, string | string[] | undefined>;
type SearchParamSource = SearchParamRecord | { get(name: string): string | null } | undefined;

const categoryIds = new Set<SearchCategoryId>(SEARCH_CATEGORIES.map(({ id }) => id));
const dateSortIds = new Set<SearchDateSortId>(["default", "latest", "oldest"]);
const deadlineSortIds = new Set<SearchDeadlineSortId>(["default", "fast", "slow"]);
const locationIds = new Set<SearchLocationId>(["all", "online", "offline"]);

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

const isSearchCategoryId = (value: string): value is SearchCategoryId => {
  return categoryIds.has(value as SearchCategoryId);
};

const isSearchDateSortId = (value: string): value is SearchDateSortId => {
  return dateSortIds.has(value as SearchDateSortId);
};

const isSearchDeadlineSortId = (value: string): value is SearchDeadlineSortId => {
  return deadlineSortIds.has(value as SearchDeadlineSortId);
};

const isSearchLocationId = (value: string): value is SearchLocationId => {
  return locationIds.has(value as SearchLocationId);
};

export const normalizeSearchKeyword = (keyword: string | null | undefined) => {
  return keyword?.trim() ?? "";
};

export const parseSearchQueryState = (searchParams: SearchParamSource): SearchQueryState => {
  const categoryId = getSearchParamValue(searchParams, "category");
  const dateSortId = getSearchParamValue(searchParams, "dateSort");
  const deadlineSortId = getSearchParamValue(searchParams, "deadlineSort");
  const keyword = getSearchParamValue(searchParams, "keyword");
  const locationId = getSearchParamValue(searchParams, "location");

  return {
    categoryId: categoryId && isSearchCategoryId(categoryId) ? categoryId : SEARCH_INITIAL_QUERY_STATE.categoryId,
    dateSortId: dateSortId && isSearchDateSortId(dateSortId) ? dateSortId : SEARCH_INITIAL_QUERY_STATE.dateSortId,
    deadlineSortId:
      deadlineSortId && isSearchDeadlineSortId(deadlineSortId)
        ? deadlineSortId
        : SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
    keyword: normalizeSearchKeyword(keyword),
    locationId: locationId && isSearchLocationId(locationId) ? locationId : SEARCH_INITIAL_QUERY_STATE.locationId,
  };
};

export const normalizeSearchCategoryId = (categoryId: SearchQueryState["categoryId"]): SearchRequestCategoryId => {
  if (categoryId === "study" || categoryId === "project") {
    return categoryId;
  }

  return "all";
};

export const normalizeSearchQueryState = (queryState: SearchQueryState): SearchRequestQueryState => {
  const keyword = normalizeSearchKeyword(queryState.keyword);

  if (queryState.deadlineSortId !== SEARCH_INITIAL_QUERY_STATE.deadlineSortId) {
    return {
      categoryId: normalizeSearchCategoryId(queryState.categoryId),
      dateSortId: SEARCH_INITIAL_QUERY_STATE.dateSortId,
      deadlineSortId: queryState.deadlineSortId,
      keyword,
      locationId: queryState.locationId,
    };
  }

  if (queryState.dateSortId !== SEARCH_INITIAL_QUERY_STATE.dateSortId) {
    return {
      categoryId: normalizeSearchCategoryId(queryState.categoryId),
      dateSortId: queryState.dateSortId,
      deadlineSortId: SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
      keyword,
      locationId: queryState.locationId,
    };
  }

  return {
    categoryId: normalizeSearchCategoryId(queryState.categoryId),
    dateSortId: queryState.dateSortId,
    deadlineSortId: queryState.deadlineSortId,
    keyword,
    locationId: queryState.locationId,
  };
};

export const buildSearchHref = (pathname: string, queryState: SearchQueryState) => {
  const searchParams = new URLSearchParams();
  const normalizedQueryState = normalizeSearchQueryState(queryState);

  if (normalizedQueryState.categoryId !== SEARCH_INITIAL_QUERY_STATE.categoryId) {
    searchParams.set("category", normalizedQueryState.categoryId);
  }

  if (normalizedQueryState.dateSortId !== SEARCH_INITIAL_QUERY_STATE.dateSortId) {
    searchParams.set("dateSort", normalizedQueryState.dateSortId);
  }

  if (normalizedQueryState.locationId !== SEARCH_INITIAL_QUERY_STATE.locationId) {
    searchParams.set("location", normalizedQueryState.locationId);
  }

  if (normalizedQueryState.deadlineSortId !== SEARCH_INITIAL_QUERY_STATE.deadlineSortId) {
    searchParams.set("deadlineSort", normalizedQueryState.deadlineSortId);
  }

  if (normalizedQueryState.keyword) {
    searchParams.set("keyword", normalizedQueryState.keyword);
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};
