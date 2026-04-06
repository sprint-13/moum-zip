import { cacheLife, cacheTag } from "next/cache";
import { postQueries } from "@/entities/post/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

export interface BulletinStats {
  total: number;
  todayCount: number;
}

export async function getBulletinStatsUseCase(spaceId: string): Promise<BulletinStats> {
  "use cache";
  cacheTag(CACHE_TAGS.bulletin(spaceId));
  cacheLife("minutes");

  const [total, todayCount] = await Promise.all([
    postQueries.countBySpaceId(spaceId),
    postQueries.countTodayBySpaceId(spaceId),
  ]);

  return { total, todayCount };
}
