import { describe, expect, it } from "vitest";
import { moimCreateSchema } from "./schema";

const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const baseInput = {
  type: "study" as const,
  name: "테스트 모임",
  capacity: 10,
  description: "설명입니다.",
  image: "https://example.com/image.jpg",
  location: "online" as const,
  date: tomorrowStr,
  time: "14:00",
  deadlineDate: tomorrowStr,
  deadlineTime: "12:00",
  themeColor: "primary",
};

describe("moimCreateSchema", () => {
  it("올바른 입력값이면 성공", () => {
    const result = moimCreateSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it("모임 일시가 현재 시각 이전이면 실패", () => {
    const result = moimCreateSchema.safeParse({
      ...baseInput,
      date: "2020-02-20",
      time: "00:00",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("모임 일시는 현재 시각 이후여야 합니다.");
  });

  it("마감일이 모임 일시 이후이면 실패", () => {
    const result = moimCreateSchema.safeParse({
      ...baseInput,
      deadlineTime: "14:30", // 모임 시간 14:00 보다 이후
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("모집 마감일은 모임 일시 이전이어야 합니다.");
  });

  it("capacity가 0이면 실패", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, capacity: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("1명 이상 입력해주세요.");
  });
});
