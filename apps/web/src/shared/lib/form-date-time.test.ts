import { describe, expect, it } from "vitest";
import { formatDate, formatTime, parseDateString, parseTimeString } from "./form-date-time";

// "0000-00-00" 형식의 문자열을 Date 객체로 변환
describe("parseDateString", () => {
  it("유효한 날짜 문자열을 Date 객체로 변환", () => {
    const result = parseDateString("2026-04-07");
    expect(result).toEqual(new Date(2026, 3, 7));
  });

  it("undefined이면 undefined를 반환", () => {
    expect(parseDateString(undefined)).toBeUndefined();
  });

  it("빈 문자열이면 undefined를 반환", () => {
    expect(parseDateString("")).toBeUndefined();
  });

  it("잘못된 형식이면 undefined를 반환", () => {
    expect(parseDateString("2026")).toBeUndefined();
  });
});

// Date 객체를 "0000-00-00" 형식의 문자열로 변환
describe("formatDate", () => {
  it("Date 객체를 yyyy-mm-dd 형식으로 변환", () => {
    const result = formatDate(new Date(2026, 3, 7));
    expect(result).toBe("2026-04-07");
  });
});

// "00:00" 형식의 문자열을 { hour, minute } 객체로 변환
describe("parseTimeString", () => {
  it("유효한 시간 문자열을 hour, minute으로 변환", () => {
    const result = parseTimeString("14:30");
    expect(result).toEqual({ hour: "14", minute: "30" });
  });

  it("undefined이면 빈 문자열을 반환", () => {
    expect(parseTimeString(undefined)).toEqual({ hour: "", minute: "" });
  });
});

// { hour, minute } 객체를 "00:00" 형식의 문자열로 변환
describe("formatTime", () => {
  it("hour, minute을 hh:mm 형식으로 변환", () => {
    expect(formatTime("14", "30")).toBe("14:30");
  });

  it("00:00을 올바르게 변환", () => {
    expect(formatTime("00", "00")).toBe("00:00");
  });
});
