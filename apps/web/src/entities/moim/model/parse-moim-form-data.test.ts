import { describe, expect, it } from "vitest";
import { parseMoimFormData } from "@/entities/moim/model/parse-moim-form-data";

const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const makeFormData = (overrides: Record<string, string> = {}): FormData => {
  const formData = new FormData();
  const defaults: Record<string, string> = {
    type: "study",
    name: "테스트 모임",
    capacity: "10",
    description: "설명입니다.",
    image:
      "https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjRfMTcw/MDAxNjY2NTQxNTAyMjE4.9uNxvgbMgHopY4EJqfCOwQiUbqEKWfbT7nE_QsdUcHgg.QliuYZbmrW_QBO0yl6fotLA7jgmjHq0486UGbvNxPpUg.JPEG.gogoa25/IMG_7088.JPG?type=w800",
    location: "online",
    date: tomorrowStr,
    time: "14:00",
    deadlineDate: tomorrowStr,
    deadlineTime: "12:00",
    themeColor: "primary",
    ...overrides,
  };
  for (const [key, value] of Object.entries(defaults)) {
    formData.append(key, value);
  }
  return formData;
};

describe("parseMoimFormData", () => {
  it("올바른 입력이면 파싱된 값을 반환", () => {
    const result = parseMoimFormData(makeFormData());
    expect(result.name).toBe("테스트 모임");
    expect(result.capacity).toBe(10);
  });

  it("필수 필드가 없으면 에러를 던짐", () => {
    expect(() => parseMoimFormData(makeFormData({ name: "" }))).toThrow();
  });

  it("Zod 검증 실패 시 에러 메시지를 던짐", () => {
    expect(() => parseMoimFormData(makeFormData({ capacity: "0" }))).toThrow("1명 이상 입력해주세요.");
  });
});
