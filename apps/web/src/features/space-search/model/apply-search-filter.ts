import { SEARCH_INITIAL_QUERY_STATE } from "./constants";
import type { SearchDateSortId, SearchDeadlineSortId, SearchLocationId, SearchQueryState } from "./types";

type SearchFilterChange =
  | { type: "category"; categoryId: SearchQueryState["categoryId"] }
  | { type: "date-sort"; dateSortId: SearchDateSortId }
  | { type: "location"; locationId: SearchLocationId }
  | { type: "deadline-sort"; deadlineSortId: SearchDeadlineSortId };

export const applySearchFilter = (
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
      deadlineSortId: SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
    };
  }

  if (change.type === "location") {
    return {
      ...currentQueryState,
      locationId: change.locationId,
    };
  }

  return {
    ...currentQueryState,
    dateSortId: SEARCH_INITIAL_QUERY_STATE.dateSortId,
    deadlineSortId: change.deadlineSortId,
  };
};
