import { SEARCH_FILTER_QUERY_STATE, SEARCH_INITIAL_QUERY_STATE } from "./constants";
import type { SearchDateSortId, SearchDeadlineSortId, SearchLocationId, SearchQueryState } from "./types";

type SearchFilterChange =
  | { type: "category"; categoryId: SearchQueryState["categoryId"] }
  | { type: "date-sort"; dateSortId: SearchDateSortId }
  | { type: "keyword"; keyword: string }
  | { type: "location"; locationId: SearchLocationId }
  | { type: "deadline-sort"; deadlineSortId: SearchDeadlineSortId }
  | { type: "reset-filters-for-keyword"; keyword: string };

export const getNextSearchQueryState = (
  currentQueryState: SearchQueryState,
  change: SearchFilterChange,
): SearchQueryState => {
  if (change.type === "category") {
    return {
      ...currentQueryState,
      categoryId: change.categoryId,
    };
  }

  if (change.type === "date-sort") {
    return {
      ...currentQueryState,
      dateSortId: change.dateSortId,
      deadlineSortId: SEARCH_FILTER_QUERY_STATE.deadlineSortId,
    };
  }

  if (change.type === "keyword") {
    return {
      ...currentQueryState,
      keyword: change.keyword,
    };
  }

  if (change.type === "location") {
    return {
      ...currentQueryState,
      locationId: change.locationId,
    };
  }

  if (change.type === "reset-filters-for-keyword") {
    return {
      ...SEARCH_INITIAL_QUERY_STATE,
      keyword: change.keyword,
    };
  }

  return {
    ...currentQueryState,
    dateSortId: SEARCH_FILTER_QUERY_STATE.dateSortId,
    deadlineSortId: change.deadlineSortId,
  };
};
