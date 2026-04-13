import { describe, expect, it } from "vitest";

import { hasSearchKeywordConflict } from "./keyword-conflict-rule";

const BASE_QUERY_STATE = {
  categoryId: "all",
  dateSortId: "default",
  deadlineSortId: "default",
  keyword: "",
  locationId: "all",
} as const;

describe("hasSearchKeywordConflict", () => {
  it("정확한 4개 충돌 케이스만 true를 반환한다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "online",
        locationId: "offline",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "offline",
        locationId: "online",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        categoryId: "study",
        keyword: "프로젝트",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        categoryId: "project",
        keyword: "스터디",
      }),
    ).toBe(true);
  });

  it("alias, 부분 일치, 일반 검색어는 충돌로 처리하지 않는다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "study",
        categoryId: "project",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "project",
        categoryId: "study",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "온라인",
        locationId: "offline",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "오프라인",
        locationId: "online",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "online class",
        locationId: "offline",
      }),
    ).toBe(false);
  });

  it("keyword 앞뒤 공백은 무시하고 exact match로 판정한다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "  online  ",
        locationId: "offline",
      }),
    ).toBe(true);
  });
});
