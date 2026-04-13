import { and, asc, count, eq, gte } from "drizzle-orm";
import { db } from "@/shared/db";
import { attendances, schedules } from "@/shared/db/scheme";

// ─── 일정 ─────────────────────────────────────────────────────────────────────

export const scheduleQueries = {
  /** 스페이스 일정 전체 조회 (시작일 오름차순) */
  findManyBySpaceId: (spaceId: string) =>
    db.query.schedules.findMany({
      where: eq(schedules.spaceId, spaceId),
      orderBy: [asc(schedules.startAt)],
    }),

  /** 단건 조회 */
  findById: (id: string) =>
    db.query.schedules.findFirst({
      where: eq(schedules.id, id),
    }),

  /** 일정 생성 */
  create: (input: {
    id: string;
    spaceId: string;
    createdBy: number;
    title: string;
    description?: string;
    startAt: Date;
  }) => db.insert(schedules).values(input).returning(),

  /** 일정 수정 */
  update: (id: string, input: { title?: string; description?: string | null; startAt?: Date }) =>
    db.update(schedules).set(input).where(eq(schedules.id, id)).returning(),

  /** 일정 삭제 */
  deleteById: (id: string) => db.delete(schedules).where(eq(schedules.id, id)).returning(),
};

// ─── 출석 ─────────────────────────────────────────────────────────────────────

export const attendanceQueries = {
  /** 특정 날짜의 스페이스 출석자 전체 조회 */
  findByDate: (spaceId: string, date: string) =>
    db.query.attendances.findMany({
      where: and(eq(attendances.spaceId, spaceId), eq(attendances.date, date)),
    }),

  /** 특정 유저의 특정 날짜 출석 여부 조회 */
  findByUserAndDate: (spaceId: string, userId: number, date: string) =>
    db.query.attendances.findFirst({
      where: and(eq(attendances.spaceId, spaceId), eq(attendances.userId, userId), eq(attendances.date, date)),
    }),

  /** 유저 기준 최근 활동 일자별 출석 수 집계 */
  countByUserDateRange: (spaceId: string, userId: number, startDate: string) =>
    db
      .select({
        date: attendances.date,
        count: count().mapWith(Number),
      })
      .from(attendances)
      .where(and(eq(attendances.spaceId, spaceId), eq(attendances.userId, userId), gte(attendances.date, startDate)))
      .groupBy(attendances.date)
      .orderBy(asc(attendances.date)),

  /** 출석 체크 등록 */
  create: (input: { id: string; spaceId: string; userId: number; date: string }) =>
    db.insert(attendances).values(input).returning(),
};
