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

  it("모집 마감 일시가 현재 시각 이전이면 실패", () => {
    const result = moimCreateSchema.safeParse({
      ...baseInput,
      deadlineDate: "2020-02-20",
      deadlineTime: "00:00",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("모집 마감 일시는 현재 시각 이후여야 합니다.");
  });

  it("마감일이 모임 일시 이후이면 실패", () => {
    const result = moimCreateSchema.safeParse({
      ...baseInput,
      deadlineTime: "15:00", // 모임 시간 14:00 보다 이후
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("모집 마감 일시는 모임 일시 이전이어야 합니다.");
  });

  it("capacity가 0이면 실패", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, capacity: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("1명 이상 입력해주세요.");
  });

  it("capacity가 최대 정원 1000을 초과하면 실패", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, capacity: 1001 });
    expect(result.success).toBe(false);
    const capacityIssue = result.error?.issues.find((issue) => issue.path[0] === "capacity");
    expect(capacityIssue?.message).toBe("최대 1000명까지 가능합니다.");
  });

  it("capacity가 최대 정원과 같으면 성공", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, capacity: 1000 });
    expect(result.success).toBe(true);
  });

  it("capacity가 음수이면 실패", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, capacity: -1 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("1명 이상 입력해주세요.");
  });

  it("모임 시간이 시만 있으면 분 선택 메시지", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, time: "14:" });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === "time");
    expect(issue?.message).toBe("분을 선택해주세요.");
  });

  it("모임 시간이 분만 있으면 시 선택 메시지", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, time: ":30" });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === "time");
    expect(issue?.message).toBe("시를 선택해주세요.");
  });

  it("모임 시간이 비어있으면 실패", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, time: "" });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === "time");
    expect(issue?.message).toBe("모임 시간을 선택해주세요.");
  });

  it("마감 시간이 분만 있으면 시 선택 메시지", () => {
    const result = moimCreateSchema.safeParse({ ...baseInput, deadlineTime: ":30" });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === "deadlineTime");
    expect(issue?.message).toBe("시를 선택해주세요.");
  });
});
