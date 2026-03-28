import { GATHERING_CATEGORY_SPECS, getGatheringCategoryLabel } from "@/entities/gathering";

import type { SpaceSearchCategory, SpaceSearchFilter, SpaceSearchQueryState } from "./types";

export const SPACE_SEARCH_CATEGORIES: SpaceSearchCategory[] = [
  { id: "all", label: "전체" },
  ...GATHERING_CATEGORY_SPECS.map(({ id }) => ({
    id,
    label: getGatheringCategoryLabel(id),
  })),
];

export const SPACE_SEARCH_FILTERS: SpaceSearchFilter[] = [
  {
    id: "date",
    label: "날짜 전체",
    options: [
      { id: "default", label: "날짜 전체" },
      { id: "latest", label: "최신 순" },
      { id: "oldest", label: "오래된 순" },
    ],
  },
  {
    id: "location",
    label: "지역 전체",
    options: [
      { id: "all", label: "온/오프라인" },
      { id: "online", label: "온라인" },
      { id: "offline", label: "오프라인" },
    ],
  },
  {
    id: "deadline",
    label: "마감 임박",
    options: [
      { id: "default", label: "마감 임박" },
      { id: "fast", label: "마감 빠른 순" },
      { id: "slow", label: "마감 느린 순" },
    ],
  },
];

export const SPACE_SEARCH_INITIAL_QUERY_STATE: SpaceSearchQueryState = {
  categoryId: "all",
  dateSortId: "default",
  deadlineSortId: "default",
  locationId: "all",
};
