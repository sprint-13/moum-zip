import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_INITIAL_QUERY_STATE } from "./constants";
import type { SpaceSearchCategoryId, SpaceSearchQueryState } from "./types";

export type SearchResultsCategoryId = "all" | "study" | "project";

type SearchParamRecord = Record<string, string | string[] | undefined>;
type SearchParamSource = SearchParamRecord | { get(name: string): string | null } | undefined;

const categoryIds = new Set<SpaceSearchCategoryId>(SPACE_SEARCH_CATEGORIES.map(({ id }) => id));

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

export const normalizeSearchCategoryId = (categoryId: SpaceSearchQueryState["categoryId"]): SearchResultsCategoryId => {
  if (categoryId === "study" || categoryId === "project") {
    return categoryId;
  }

  return "all";
};

export const parseSpaceSearchQueryState = (searchParams: SearchParamSource): SpaceSearchQueryState => {
  const categoryId = getSearchParamValue(searchParams, "category");

  return {
    categoryId:
      categoryId && isSpaceSearchCategoryId(categoryId) ? categoryId : SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId,
  };
};

export const buildSpaceSearchHref = (pathname: string, queryState: SpaceSearchQueryState) => {
  const searchParams = new URLSearchParams();
  const normalizedCategoryId = normalizeSearchCategoryId(queryState.categoryId);

  if (normalizedCategoryId !== SPACE_SEARCH_INITIAL_QUERY_STATE.categoryId) {
    searchParams.set("category", normalizedCategoryId);
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};
