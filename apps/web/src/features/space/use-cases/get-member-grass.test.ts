import { beforeEach, describe, expect, it } from "vitest";
import { createGetGrassUseCase } from "./get-member-grass";

describe("getSpaceMemberGrassUseCase", () => {
  let repository: {
    countPostsByDateRange: ReturnType<typeof createCountStub>;
    countCommentsByDateRange: ReturnType<typeof createCountStub>;
    countAttendancesByDateRange: ReturnType<typeof createCountStub>;
  };

  beforeEach(() => {
    repository = {
      countPostsByDateRange: createCountStub(),
      countCommentsByDateRange: createCountStub(),
      countAttendancesByDateRange: createCountStub(),
    };
  });

  it("84일 활동을 날짜별로 병합하고 요약값을 계산한다", async () => {
    repository.countPostsByDateRange.setRows([
      { date: "2026-04-07", count: 1 },
      { date: "2026-04-09", count: 2 },
    ]);
    repository.countCommentsByDateRange.setRows([
      { date: "2026-04-08", count: 2 },
      { date: "2026-04-09", count: 1 },
    ]);
    repository.countAttendancesByDateRange.setRows([{ date: "2026-04-09", count: 1 }]);

    const useCase = createGetGrassUseCase({
      repository,
      getTodayDateKey: () => "2026-04-09",
    });
    const result = await useCase("space-1", 7, { days: 84 });

    expect(repository.countPostsByDateRange.calls[0]).toMatchObject({
      spaceId: "space-1",
      userId: 7,
    });
    expect(repository.countCommentsByDateRange.calls[0]).toMatchObject({
      spaceId: "space-1",
      userId: 7,
    });
    expect(repository.countAttendancesByDateRange.calls[0]).toEqual({
      spaceId: "space-1",
      userId: 7,
      startDate: "2026-01-16",
    });

    expect(result.days).toHaveLength(84);
    expect(result.days[0]?.date).toBe("2026-01-16");
    expect(result.days.at(-1)?.date).toBe("2026-04-09");
    expect(result.days.find((day) => day.date === "2026-04-07")).toMatchObject({
      postCount: 1,
      commentCount: 0,
      attendanceCount: 0,
      score: 2,
      intensity: 2,
    });
    expect(result.days.find((day) => day.date === "2026-04-08")).toMatchObject({
      postCount: 0,
      commentCount: 2,
      attendanceCount: 0,
      score: 2,
      intensity: 2,
    });
    expect(result.days.find((day) => day.date === "2026-04-09")).toMatchObject({
      postCount: 2,
      commentCount: 1,
      attendanceCount: 1,
      score: 6,
      intensity: 4,
    });
    expect(result.summary).toEqual({
      currentStreak: 3,
      recentScore: 10,
      activeDays: 3,
    });
  });

  it("days 옵션을 사용하면 더 짧은 기간으로 집계한다", async () => {
    repository.countPostsByDateRange.setRows([{ date: "2026-04-09", count: 1 }]);

    const useCase = createGetGrassUseCase({
      repository,
      getTodayDateKey: () => "2026-04-09",
    });
    const result = await useCase("space-1", 7, { days: 3 });

    expect(repository.countAttendancesByDateRange.calls[0]).toEqual({
      spaceId: "space-1",
      userId: 7,
      startDate: "2026-04-07",
    });
    expect(result.days.map((day) => day.date)).toEqual(["2026-04-07", "2026-04-08", "2026-04-09"]);
    expect(result.summary).toEqual({
      currentStreak: 1,
      recentScore: 2,
      activeDays: 1,
    });
  });
});

const createCountStub = () => {
  let rows: Array<{ date: string; count: number }> = [];
  const calls: Array<{ spaceId: string; userId: number; startDate?: string; startAt?: Date }> = [];

  const stub = async (spaceId: string, userId: number, rangeStart: string | Date) => {
    calls.push(
      rangeStart instanceof Date
        ? { spaceId, userId, startAt: rangeStart }
        : { spaceId, userId, startDate: rangeStart },
    );

    return rows;
  };

  return Object.assign(stub, {
    calls,
    setRows: (nextRows: Array<{ date: string; count: number }>) => {
      rows = nextRows;
    },
  });
};
