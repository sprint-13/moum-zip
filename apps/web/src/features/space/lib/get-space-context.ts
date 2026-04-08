import { cache } from "react";
import { type Member, memberQueries } from "@/entities/member";
import type { SpaceInfo } from "@/entities/spaces";
import { isAuth } from "@/shared/api/server";
import { AppError } from "@/shared/lib/error";
import { safe } from "@/shared/lib/safe";
import { getSpaceInfoUseCase } from "../use-cases/get-space-info";

export interface SpaceContext {
  space: SpaceInfo;
  membership: Member;
}

export const getSpaceContext = cache(async (slug: string): Promise<SpaceContext> => {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) {
    throw new AppError("UNAUTHENTICATED");
  }

  const space = await getSpaceInfoUseCase(slug);

  const membership = await safe(memberQueries.getMember(space.spaceId, auth.userId), {
    notFound: () => {
      throw new AppError("SPACE_ACCESS_DENIED");
    },
  });

  return { space, membership };
});
