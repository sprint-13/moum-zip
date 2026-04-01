import { unstable_cache } from "next/cache";
import type { AttendanceStatus, ScheduleWithStatus } from "@/entities/schedule";
import { getNowKST, getTodayKST } from "@/entities/schedule/model/types";
import { attendanceQueries, scheduleQueries } from "@/entities/schedule/queries";

export interface GetSchedulesResult {
  upcoming: ScheduleWithStatus[];
  expired: ScheduleWithStatus[];
  attendance: AttendanceStatus;
}

async function fetchSchedules(spaceId: string, userId: number): Promise<GetSchedulesResult> {
  const today = getTodayKST();
  const now = getNowKST();

  const [rows, todayAttendances, userAttendance] = await Promise.all([
    scheduleQueries.findManyBySpaceId(spaceId),
    attendanceQueries.findByDate(spaceId, today),
    attendanceQueries.findByUserAndDate(spaceId, userId, today),
  ]);

  const classified: ScheduleWithStatus[] = rows.map((schedule) => {
    const startAt = new Date(schedule.startAt);
    return {
      ...schedule,
      isExpired: startAt < now,
      isUpcoming: startAt >= now,
    };
  });

  return {
    upcoming: classified.filter((s) => !s.isExpired),
    expired: classified.filter((s) => s.isExpired),
    attendance: {
      hasCheckedIn: !!userAttendance,
      todayAttendeeIds: todayAttendances.map((a) => a.userId),
    },
  };
}

/**
 * 스페이스 일정 목록 + 오늘 출석 현황 조회 (Next.js Data Cache 적용).
 * 일정 추가/수정/삭제, 출석 체크 시 revalidateTag(`schedules-${spaceId}`)로 무효화.
 */
export function getSchedulesUseCase(spaceId: string, userId: number): Promise<GetSchedulesResult> {
  return unstable_cache(() => fetchSchedules(spaceId, userId), ["schedules", spaceId, String(userId)], {
    tags: [`schedules-${spaceId}`],
    revalidate: 60,
  })();
}
