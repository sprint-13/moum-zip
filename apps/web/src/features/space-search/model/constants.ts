import type { SpaceSearchCategory, SpaceSearchFilter, SpaceSearchQueryState } from "./types";

export const SPACE_SEARCH_CATEGORIES: SpaceSearchCategory[] = [
  { id: "all", label: "전체" },
  { id: "study", label: "스터디" },
  { id: "project", label: "프로젝트" },
];

export const SPACE_SEARCH_FILTERS: SpaceSearchFilter[] = [
  { id: "date", label: "날짜 전체" },
  { id: "district", label: "지역 전체" },
  { id: "deadline", label: "마감 임박" },
];

export const SPACE_SEARCH_INITIAL_QUERY_STATE: SpaceSearchQueryState = {
  categoryId: "all",
};
