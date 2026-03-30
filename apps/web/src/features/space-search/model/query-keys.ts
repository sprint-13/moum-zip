import type { SearchResultsQueryState } from "./search-params";

export const spaceSearchQueryKeys = {
  all: ["search-results"] as const,
  list: (queryState: SearchResultsQueryState, isAuthenticated: boolean) =>
    [...spaceSearchQueryKeys.all, queryState, { isAuthenticated }] as const,
};
