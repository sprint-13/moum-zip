import { describe, expect, it } from "vitest";

import { SEARCH_INITIAL_QUERY_STATE } from "./constants";
import { getNextSearchQueryState } from "./next-search-query-state";

const BASE_QUERY_STATE = {
  categoryId: "all",
  dateSortId: "default",
  deadlineSortId: "default",
  keyword: "",
  locationId: "all",
} as const;

describe("getNextSearchQueryState", () => {
  it("카테고리를 변경한다", () => {
    const nextQueryState = getNextSearchQueryState(BASE_QUERY_STATE, {
      type: "category",
      categoryId: "study",
    });

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      categoryId: "study",
    });
  });

  it("날짜 정렬을 변경하면 마감 정렬을 초기화한다", () => {
    const nextQueryState = getNextSearchQueryState(
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
    const nextQueryState = getNextSearchQueryState(
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
    const nextQueryState = getNextSearchQueryState(BASE_QUERY_STATE, {
      type: "location",
      locationId: "online",
    });

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      locationId: "online",
    });
  });

  it("키워드 검색어를 변경한다", () => {
    const nextQueryState = getNextSearchQueryState(BASE_QUERY_STATE, {
      type: "keyword",
      keyword: "offline",
    });

    expect(nextQueryState).toEqual({
      ...BASE_QUERY_STATE,
      keyword: "offline",
    });
  });

  it("키워드 재검색 시 키워드만 유지하고 다른 필터를 초기화한다", () => {
    const nextQueryState = getNextSearchQueryState(
      {
        categoryId: "study",
        dateSortId: "latest",
        deadlineSortId: "fast",
        keyword: "online",
        locationId: "offline",
      },
      {
        type: "reset-filters-for-keyword",
        keyword: "online",
      },
    );

    expect(nextQueryState).toEqual({
      ...SEARCH_INITIAL_QUERY_STATE,
      keyword: "online",
    });
  });
});
