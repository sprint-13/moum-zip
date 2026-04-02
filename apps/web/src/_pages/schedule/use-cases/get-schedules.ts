import { cache } from "react";
import type { AttendanceStatus, ScheduleWithStatus } from "@/entities/schedule";
import { getNowKST, getTodayKST } from "@/entities/schedule/model/types";
import { attendanceQueries, scheduleQueries } from "@/entities/schedule/queries";

export interface GetSchedulesResult {
  upcoming: ScheduleWithStatus[];
  expired: ScheduleWithStatus[];
  attendance: AttendanceStatus;
}

export const getSchedulesUseCase = cache(async (spaceId: string, userId: number): Promise<GetSchedulesResult> => {
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
});
