import { cacheLife, cacheTag } from "next/cache";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { getNowKST } from "@/entities/schedule/model/types";
import { scheduleQueries } from "@/entities/schedule/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

export interface GetScheduleListResult {
  upcoming: ScheduleWithStatus[];
  expired: ScheduleWithStatus[];
}

export async function getScheduleListUseCase(spaceId: string): Promise<GetScheduleListResult> {
  "use cache";
  cacheTag(CACHE_TAGS.schedule(spaceId));
  cacheLife("days");

  const now = getNowKST();
  const rows = await scheduleQueries.findManyBySpaceId(spaceId);

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
  };
}
