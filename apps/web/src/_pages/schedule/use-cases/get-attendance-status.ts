import { cacheLife, cacheTag } from "next/cache";
import type { AttendanceStatus } from "@/entities/schedule";
import { getTodayKST } from "@/entities/schedule/model/types";
import { attendanceQueries } from "@/entities/schedule/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

export async function getAttendanceStatusUseCase(spaceId: string, userId: number): Promise<AttendanceStatus> {
  "use cache";
  cacheTag(CACHE_TAGS.attendance(spaceId, userId));
  cacheLife("hours");

  const today = getTodayKST();

  const [todayAttendances, userAttendance] = await Promise.all([
    attendanceQueries.findByDate(spaceId, today),
    attendanceQueries.findByUserAndDate(spaceId, userId, today),
  ]);

  return {
    hasCheckedIn: !!userAttendance,
    todayAttendeeIds: todayAttendances.map((a) => a.userId),
  };
}
