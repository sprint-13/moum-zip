import { notFound, redirect } from "next/navigation";
import type { SpaceInfo } from "@/entities/spaces";
import { isAuth } from "@/shared/api/server";
import { getSpaceMembershipQuery } from "@/shared/db/queries";
import { getSpaceInfoUseCase } from "../use-cases/get-space-info";

export interface SpaceContext {
  space: SpaceInfo;
  membership: NonNullable<Awaited<ReturnType<typeof getSpaceMembershipQuery>>>;
}

export async function getSpaceContext(slug: string): Promise<SpaceContext> {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) redirect("/login");

  const space = await getSpaceInfoUseCase(slug);
  if (!space) notFound();

  const membership = await getSpaceMembershipQuery(space.spaceId, auth.userId);
  if (!membership) redirect("/spaces");

  return { space, membership };
}
