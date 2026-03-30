"use server";

import { revalidateTag } from "next/cache";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";

export async function addSpaceMemberAction(slug: string, pendingUser: PendingUser) {
  const { space } = await getSpaceContext(slug);
  await addSpaceMemberUseCase(space.spaceId, pendingUser.userId, pendingUser.name, pendingUser.image);
  revalidateTag(`members-${space.spaceId}`, "max");
}
