import { normalizeSearchKeyword } from "./search-params";
import type { SearchQueryState } from "./types";

export const hasSearchKeywordConflict = ({ categoryId, keyword, locationId }: SearchQueryState) => {
  const normalizedKeyword = normalizeSearchKeyword(keyword);

  if (normalizedKeyword === "online") {
    return locationId === "offline";
  }

  if (normalizedKeyword === "offline") {
    return locationId === "online";
  }

  if (normalizedKeyword === "프로젝트") {
    return categoryId === "study";
  }

  if (normalizedKeyword === "스터디") {
    return categoryId === "project";
  }

  return false;
};
