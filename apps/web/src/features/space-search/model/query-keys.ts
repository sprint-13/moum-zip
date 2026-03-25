import type { SearchResultsCategoryId } from "./search-params";

export const spaceSearchQueryKeys = {
  all: ["search-results"] as const,
  list: (categoryId: SearchResultsCategoryId) => [...spaceSearchQueryKeys.all, categoryId] as const,
};
