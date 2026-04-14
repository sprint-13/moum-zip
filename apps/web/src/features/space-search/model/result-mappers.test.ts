import { describe, expect, it } from "vitest";

import type { SearchResultItem } from "@/entities/gathering";

import { mapSearchResultItemToSpaceCardItem } from "./result-mappers";

const createSearchResultItem = (overrides?: Partial<SearchResultItem>): SearchResultItem => ({
  address: null,
  capacity: 10,
  confirmedAt: null,
  dateTime: "2026-04-13T19:00:00",
  description: null,
  id: "1",
  image: null,
  isLiked: false,
  location: "online",
  participantCount: 3,
  region: "online",
  registrationEnd: "2026-04-14T18:00:00",
  slug: "",
  title: "스터디 모임",
  type: "study",
  ...overrides,
});

describe("result-mappers", () => {
  it("이미 신청했고 개설 확정된 모임은 상태 배지를 순서대로 매핑한다", () => {
    const item = createSearchResultItem({
      confirmedAt: "2026-04-13T09:00:00",
      isJoined: true,
    });

    const result = mapSearchResultItemToSpaceCardItem(item);

    expect(result.statuses).toEqual([{ label: "신청 완료" }, { label: "개설 확정" }]);
  });

  it("신청 완료 상태만 있으면 해당 배지만 표시한다", () => {
    const item = createSearchResultItem({
      confirmedAt: null,
      isJoined: true,
    });

    const result = mapSearchResultItemToSpaceCardItem(item);

    expect(result.statuses).toEqual([{ label: "신청 완료" }]);
  });

  it("개설 확정 상태만 있으면 해당 배지만 표시한다", () => {
    const item = createSearchResultItem({
      confirmedAt: "2026-04-13T09:00:00",
      isJoined: undefined,
    });

    const result = mapSearchResultItemToSpaceCardItem(item);

    expect(result.statuses).toEqual([{ label: "개설 확정" }]);
  });

  it("표시할 상태가 없으면 상태 배열을 만들지 않는다", () => {
    const item = createSearchResultItem({
      confirmedAt: null,
      isJoined: undefined,
    });

    const result = mapSearchResultItemToSpaceCardItem(item);

    expect(result.statuses).toBeUndefined();
  });
});
