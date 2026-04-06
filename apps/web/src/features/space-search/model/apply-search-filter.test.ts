import { describe, expect, it } from "vitest";

import { applySearchFilter } from "./apply-search-filter";
import { SEARCH_INITIAL_QUERY_STATE } from "./constants";

const BASE_QUERY_STATE = {
  categoryId: "all",
  dateSortId: "default",
  deadlineSortId: "default",
  locationId: "all",
} as const;

describe("applySearchFilter", () => {
  it("카테고리를 변경한다", () => {
    const nextQueryState = applySearchFilter(BASE_QUERY_STATE, {
      type: "category",
      categoryId: "study",
    });

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      categoryId: "study",
    });
  });

  it("날짜 정렬을 변경하면 마감 정렬을 초기화한다", () => {
    const nextQueryState = applySearchFilter(
      {
        ...BASE_QUERY_STATE,
        deadlineSortId: "fast",
      },
      {
        type: "date-sort",
        dateSortId: "latest",
      },
    );

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      dateSortId: "latest",
      deadlineSortId: SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
    });
  });

  it("마감 정렬을 변경하면 날짜 정렬을 초기화한다", () => {
    const nextQueryState = applySearchFilter(
      {
        ...BASE_QUERY_STATE,
        dateSortId: "oldest",
      },
      {
        type: "deadline-sort",
        deadlineSortId: "slow",
      },
    );

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      dateSortId: SEARCH_INITIAL_QUERY_STATE.dateSortId,
      deadlineSortId: "slow",
    });
  });

  it("장소 필터를 변경한다", () => {
    const nextQueryState = applySearchFilter(BASE_QUERY_STATE, {
      type: "location",
      locationId: "online",
    });

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      locationId: "online",
    });
  });
});
