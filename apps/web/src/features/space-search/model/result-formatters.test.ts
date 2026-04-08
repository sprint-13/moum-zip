import { describe, expect, it } from "vitest";

import { formatSearchDateChipLabel, formatSearchTimeChipLabel, getSearchDeadlineMeta } from "./result-formatters";

describe("result-formatters", () => {
  it("날짜와 시간이 없으면 fallback 문구를 반환한다", () => {
    expect(formatSearchDateChipLabel(null)).toBe("일정 미정");
    expect(formatSearchTimeChipLabel(null)).toBe("시간 미정");
  });

  it("로컬 시간 기준으로 날짜와 시간을 포맷한다", () => {
    expect(formatSearchDateChipLabel("2026-04-08T14:30:00")).toBe("4.8");
    expect(formatSearchTimeChipLabel("2026-04-08T14:30:00")).toBe("14:30");
  });

  it("마감일이 없으면 상시 모집으로 표시한다", () => {
    expect(getSearchDeadlineMeta(null)).toEqual({
      deadlineLabel: "상시 모집",
      isRegistClosed: false,
    });
  });

  it("같은 날 마감이면 오늘 HH:mm 마감 문구를 반환한다", () => {
    expect(getSearchDeadlineMeta("2026-04-08T18:00:00", new Date("2026-04-08T12:00:00").getTime())).toEqual({
      deadlineLabel: "오늘 18:00 마감",
      isRegistClosed: false,
    });
  });

  it("다음 날 마감이면 남은 일 수를 계산한다", () => {
    expect(getSearchDeadlineMeta("2026-04-09T09:00:00", new Date("2026-04-08T23:30:00").getTime())).toEqual({
      deadlineLabel: "1일 후 마감",
      isRegistClosed: false,
    });
  });

  it("마감 시간이 지났으면 마감 상태를 반환한다", () => {
    expect(getSearchDeadlineMeta("2026-04-08T09:00:00", new Date("2026-04-08T12:00:00").getTime())).toEqual({
      deadlineLabel: "마감",
      isRegistClosed: true,
    });
  });
});
