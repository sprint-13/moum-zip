import { describe, expect, it, vi } from "vitest";

import { getSearchCategories } from "./get-search-categories";

describe("getSearchCategories", () => {
  it("존재하는 meeting-types만 검색 탭에 노출한다", async () => {
    const mockMeetingTypesApi = {
      getList: vi.fn().mockResolvedValue({
        data: [{ id: 1, teamId: "team-1", name: "study", description: null, createdAt: null }],
      }),
    };

    const result = await getSearchCategories({ meetingTypesApi: mockMeetingTypesApi });

    expect(result).toEqual([
      { id: "all", label: "전체" },
      { id: "study", label: "스터디" },
    ]);
  });

  it("영문/한글 meeting-types 이름을 같은 카테고리로 정규화한다", async () => {
    const mockMeetingTypesApi = {
      getList: vi.fn().mockResolvedValue({
        data: [
          { id: 1, teamId: "team-1", name: "스터디", description: null, createdAt: null },
          { id: 2, teamId: "team-1", name: "project", description: null, createdAt: null },
          { id: 3, teamId: "team-1", name: "프로젝트", description: null, createdAt: null },
        ],
      }),
    };

    const result = await getSearchCategories({ meetingTypesApi: mockMeetingTypesApi });

    expect(result).toEqual([
      { id: "all", label: "전체" },
      { id: "study", label: "스터디" },
      { id: "project", label: "프로젝트" },
    ]);
  });

  it("meeting-types 요청이 실패하면 전체 탭만 반환한다", async () => {
    const mockMeetingTypesApi = {
      getList: vi.fn().mockRejectedValue(new Error("FAILED_TO_GET_MEETING_TYPES")),
    };

    const result = await getSearchCategories({ meetingTypesApi: mockMeetingTypesApi });

    expect(result).toEqual([{ id: "all", label: "전체" }]);
  });
});
