import { GATHERING_CATEGORY_SPECS, getGatheringCategoryLabel } from "@/entities/gathering";

import type { SearchCategory, SearchFilter, SearchQueryState } from "./types";

export const SEARCH_CATEGORIES: SearchCategory[] = [
  { id: "all", label: "전체" },
  ...GATHERING_CATEGORY_SPECS.map(({ id }) => ({
    id,
    label: getGatheringCategoryLabel(id),
  })),
];

export const SEARCH_FILTERS: SearchFilter[] = [
  {
    id: "date",
    label: "최신/오래된 순",
    options: [
      { id: "default", label: "최신/오래된 순" },
      { id: "latest", label: "최신 순" },
      { id: "oldest", label: "오래된 순" },
    ],
  },
  {
    id: "location",
    label: "온/오프라인",
    options: [
      { id: "all", label: "온/오프라인" },
      { id: "online", label: "온라인" },
      { id: "offline", label: "오프라인" },
    ],
  },
  {
    id: "deadline",
    label: "마감 빠른/느린 순",
    options: [
      { id: "default", label: "마감 빠른/느린 순" },
      { id: "fast", label: "마감 빠른 순" },
      { id: "slow", label: "마감 느린 순" },
    ],
  },
];

export const SEARCH_FILTER_QUERY_STATE: SearchQueryState = {
  categoryId: "all",
  dateSortId: "default",
  deadlineSortId: "default",
  locationId: "all",
};

export const SEARCH_INITIAL_QUERY_STATE: SearchQueryState = {
  ...SEARCH_FILTER_QUERY_STATE,
  dateSortId: "latest",
};
