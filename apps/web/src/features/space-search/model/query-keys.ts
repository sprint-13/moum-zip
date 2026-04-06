import type { SearchResultsQueryState } from "./search-params";

export const searchQueryKeys = {
  all: ["search-results"] as const,
  list: (queryState: SearchResultsQueryState, isAuthenticated: boolean) =>
    [...searchQueryKeys.all, queryState, { isAuthenticated }] as const,
};
