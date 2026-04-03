import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { type Member, memberQueries } from "@/entities/member";
import type { SpaceInfo } from "@/entities/spaces";
import { isAuth } from "@/shared/api/server";
import { getSpaceInfoUseCase } from "../use-cases/get-space-info";

export interface SpaceContext {
  space: SpaceInfo;
  membership: Member;
}

export const getSpaceContext = cache(async (slug: string): Promise<SpaceContext> => {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) redirect("/login");

  const space = await getSpaceInfoUseCase(slug);
  if (!space) notFound();

  const membership = await memberQueries.getMember(space.spaceId, auth.userId);
  if (!membership) redirect("/spaces");

  return { space, membership };
});
