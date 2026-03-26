import type { SearchResultsQueryState } from "./search-params";

export const spaceSearchQueryKeys = {
  all: ["search-results"] as const,
  list: (queryState: SearchResultsQueryState) => [...spaceSearchQueryKeys.all, queryState] as const,
};
