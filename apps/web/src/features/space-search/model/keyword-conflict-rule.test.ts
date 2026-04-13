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
  it("정확한 4개 충돌 케이스를 true로 판정한다", () => {
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

  it("CTA 판정용 alias와 영어 대소문자를 허용한다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "Online",
        locationId: "offline",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "OFFLINE",
        locationId: "online",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "프로젝트",
        categoryId: "study",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "study",
        categoryId: "project",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "온라인",
        locationId: "offline",
      }),
    ).toBe(true);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "오프라인",
        locationId: "online",
      }),
    ).toBe(true);
  });

  it("부분 일치나 일반 검색어는 충돌로 처리하지 않는다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "online class",
        locationId: "offline",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "project room",
        categoryId: "study",
      }),
    ).toBe(false);

    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "같이 스터디해요",
        categoryId: "project",
      }),
    ).toBe(false);
  });

  it("keyword 앞뒤 공백은 무시한다", () => {
    expect(
      hasSearchKeywordConflict({
        ...BASE_QUERY_STATE,
        keyword: "  online  ",
        locationId: "offline",
      }),
    ).toBe(true);
  });
});
