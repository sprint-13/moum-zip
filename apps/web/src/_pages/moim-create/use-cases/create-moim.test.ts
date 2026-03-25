import { beforeEach, describe, expect, it, vi } from "vitest";
import * as spaceQueries from "@/entities/space/queries";
import { createMoim } from "./create-moim";

// shared/db를 빈 객체로 대체해 neon() 실행 차단
vi.mock("@/shared/db", () => ({
  db: {},
}));

vi.mock("@/entities/space/queries");

const mockInsertSpace = vi.mocked(spaceQueries.insertSpace);
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// 내일 날짜 (현재 시각 이후 보장)
const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const baseInput = {
  type: "study" as const,
  name: "테스트 모임",
  capacity: 10,
  description: "설명입니다.",
  image:
    "https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjRfMTcw/MDAxNjY2NTQxNTAyMjE4.9uNxvgbMgHopY4EJqfCOwQiUbqEKWfbT7nE_QsdUcHgg.QliuYZbmrW_QBO0yl6fotLA7jgmjHq0486UGbvNxPpUg.JPEG.gogoa25/IMG_7088.JPG?type=w800",
  location: "online" as const,
  date: tomorrowStr,
  time: "14:00",
  deadlineDate: tomorrowStr,
  deadlineTime: "12:00",
  themeColor: "primary",
  options: [],
};

// DB insert 성공했을 때 반환될 가짜 결과값
const mockSpaceResult = {
  id: "20",
  slug: "20",
  meetingId: 20,
  location: "online" as const,
  themeColor: "primary",
  status: "ongoing" as const,
  modules: [],
  createdAt: new Date(),
};

describe("createMoim", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 외부 API 성공 mock
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 20 }),
    });

    // DB insert 성공 mock
    mockInsertSpace.mockResolvedValue(mockSpaceResult);
  });

  it("외부 API 호출 후 SPACE DB에 저장", async () => {
    const result = await createMoim(baseInput, "test-token");

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockInsertSpace).toHaveBeenCalledOnce();
    expect(result.meeting.id).toBe(20);
    expect(result.space.slug).toBe("20");
  });

  it("meetings API에 올바른 payload를 전달", async () => {
    await createMoim(baseInput, "test-token");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/meetings"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("외부 API 실패 시 에러를 던짐", async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(createMoim(baseInput, "test-token")).rejects.toThrow("모임 생성에 실패했습니다.");
  });

  it("외부 API 실패 시 SPACE DB insert를 호출하지 않는다", async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(createMoim(baseInput, "test-token")).rejects.toThrow();
    expect(mockInsertSpace).not.toHaveBeenCalled();
  });
});
