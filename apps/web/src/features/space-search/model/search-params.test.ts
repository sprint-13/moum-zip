import { describe, expect, it } from "vitest";

import { buildSearchHref, normalizeSearchKeyword, parseSearchQueryState } from "./search-params";

describe("normalizeSearchKeyword", () => {
  it("검색어 앞뒤 공백을 제거한다", () => {
    expect(normalizeSearchKeyword("  online  ")).toBe("online");
  });

  it("빈 문자열과 undefined를 빈 문자열로 정규화한다", () => {
    expect(normalizeSearchKeyword("   ")).toBe("");
    expect(normalizeSearchKeyword(undefined)).toBe("");
  });
});

describe("parseSearchQueryState", () => {
  it("keyword를 trim해서 파싱한다", () => {
    const queryState = parseSearchQueryState(new URLSearchParams("keyword=%20offline%20&location=online"));

    expect(queryState).toEqual({
      categoryId: "all",
      dateSortId: "default",
      deadlineSortId: "default",
      keyword: "offline",
      locationId: "online",
    });
  });

  it("잘못된 값은 초기값으로 되돌린다", () => {
    const queryState = parseSearchQueryState(
      new URLSearchParams("category=invalid&dateSort=wrong&deadlineSort=wrong&location=wrong"),
    );

    expect(queryState).toEqual({
      categoryId: "all",
      dateSortId: "default",
      deadlineSortId: "default",
      keyword: "",
      locationId: "all",
    });
  });
});

describe("buildSearchHref", () => {
  it("keyword가 비어 있으면 URL에 포함하지 않는다", () => {
    const href = buildSearchHref("/search", {
      categoryId: "all",
      dateSortId: "default",
      deadlineSortId: "default",
      keyword: "   ",
      locationId: "all",
    });

    expect(href).toBe("/search");
  });

  it("keyword를 trim한 뒤 다른 필터와 함께 URL을 구성한다", () => {
    const href = buildSearchHref("/search", {
      categoryId: "study",
      dateSortId: "default",
      deadlineSortId: "default",
      keyword: "  offline  ",
      locationId: "online",
    });

    expect(href).toBe("/search?category=study&location=online&keyword=offline");
  });
});
