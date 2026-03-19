import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_INITIAL_QUERY_STATE, SPACE_SEARCH_MOCK_ITEMS } from "./constants";
import type { SpaceSearchCategoryId, SpaceSearchQueryState, SpaceSearchResultPage } from "./types";

const SPACE_SEARCH_ITEMS_PER_PAGE = 4;

type SearchParamRecord = Record<string, string | string[] | undefined>;
type SearchParamSource = SearchParamRecord | { get(name: string): string | null } | undefined;

const categoryLabelById = new Map<SpaceSearchCategoryId, string>(
  SPACE_SEARCH_CATEGORIES.map(({ id, label }) => [id, label]),
);

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

const parsePositiveInteger = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

export const parseSpaceSearchQueryState = (searchParams: SearchParamSource): SpaceSearchQueryState => {
  const categoryId = getSearchParamValue(searchParams, "category");
  const page = parsePositiveInteger(getSearchParamValue(searchParams, "page"), SPACE_SEARCH_INITIAL_QUERY_STATE.page);

  return {
    categoryId:
      categoryId && categoryLabelById.has(categoryId) ? categoryId : SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId,
    page,
  };
};

export const buildSpaceSearchHref = (pathname: string, queryState: SpaceSearchQueryState) => {
  const searchParams = new URLSearchParams();

  if (queryState.categoryId !== SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId) {
    searchParams.set("category", queryState.categoryId);
  }

  if (queryState.page > 1) {
    searchParams.set("page", String(queryState.page));
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

export const getSpaceSearchResultPage = (queryState: SpaceSearchQueryState): SpaceSearchResultPage => {
  // TODO: API 연동 시 mock 필터링 대신 서버 응답을 매핑 예정
  let filteredItems = [...SPACE_SEARCH_MOCK_ITEMS];

  if (queryState.categoryId !== SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId) {
    const selectedCategoryLabel = categoryLabelById.get(queryState.categoryId);

    if (selectedCategoryLabel) {
      filteredItems = filteredItems.filter(({ category }) => category === selectedCategoryLabel);
    }
  }

  const totalPages = filteredItems.length === 0 ? 0 : Math.ceil(filteredItems.length / SPACE_SEARCH_ITEMS_PER_PAGE);
  const currentPage = totalPages === 0 ? 1 : Math.min(queryState.page, totalPages);
  const startIndex = (currentPage - 1) * SPACE_SEARCH_ITEMS_PER_PAGE;

  return {
    items: filteredItems.slice(startIndex, startIndex + SPACE_SEARCH_ITEMS_PER_PAGE),
    pagination: {
      currentPage,
      totalPages,
    },
  };
};
