import { cacheLife, cacheTag } from "next/cache";
import { postQueries } from "@/entities/post/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

export type PopularPost = Awaited<ReturnType<typeof postQueries.findPopularBySpaceId>>[number];

export async function getPopularPostsUseCase(spaceId: string): Promise<PopularPost[]> {
  "use cache";
  cacheTag(CACHE_TAGS.bulletin(spaceId));
  cacheLife("minutes");

  return postQueries.findPopularBySpaceId(spaceId);
}
