import type { SearchRequestQueryState } from "./types";

export const searchQueryKeys = {
  all: ["search-results"] as const,
  list: (queryState: SearchRequestQueryState, isAuthenticated: boolean) =>
    [...searchQueryKeys.all, queryState, { isAuthenticated }] as const,
};
