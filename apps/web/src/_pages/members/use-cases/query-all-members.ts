import { unstable_cache } from "next/cache";
import { memberQueries } from "@/entities/member";

export const queryAllMembersUseCase = (spaceId: string) => {
  return unstable_cache(async () => memberQueries.findAllBySpaceId(spaceId), ["space-all-members", spaceId], {
    tags: ["space-all-members", spaceId],
    revalidate: 3600,
  })();
};
