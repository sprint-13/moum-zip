import { normalizeSearchKeyword } from "./search-params";
import type { SearchQueryState } from "./types";

type SearchKeywordConflictToken = "offline" | "online" | "project" | "study";

const normalizeSearchKeywordConflictToken = (
  keyword: SearchQueryState["keyword"],
): SearchKeywordConflictToken | null => {
  const normalizedKeyword = normalizeSearchKeyword(keyword).toLowerCase();

  if (normalizedKeyword === "online" || normalizedKeyword === "온라인") {
    return "online";
  }

  if (normalizedKeyword === "offline" || normalizedKeyword === "오프라인") {
    return "offline";
  }

  if (normalizedKeyword === "project" || normalizedKeyword === "프로젝트") {
    return "project";
  }

  if (normalizedKeyword === "study" || normalizedKeyword === "스터디") {
    return "study";
  }

  return null;
};

export const hasSearchKeywordConflict = ({ categoryId, keyword, locationId }: SearchQueryState) => {
  const conflictToken = normalizeSearchKeywordConflictToken(keyword);

  if (conflictToken === "online") {
    return locationId === "offline";
  }

  if (conflictToken === "offline") {
    return locationId === "online";
  }

  if (conflictToken === "project") {
    return categoryId === "study";
  }

  if (conflictToken === "study") {
    return categoryId === "project";
  }

  return false;
};
