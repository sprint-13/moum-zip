import { cacheLife, cacheTag } from "next/cache";
import { memberQueries } from "@/entities/member";
import { CACHE_TAGS } from "@/shared/lib/cache";

export async function queryAllMembersUseCase(spaceId: string) {
  "use cache";
  cacheTag(CACHE_TAGS.members(spaceId));
  cacheLife("days");

  return memberQueries.findAllBySpaceId(spaceId);
}
