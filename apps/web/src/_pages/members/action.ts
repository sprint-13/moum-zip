"use server";

import { updateTag } from "next/cache";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";

export async function addSpaceMemberAction(slug: string, pendingUser: PendingUser) {
  const { space, membership } = await getSpaceContext(slug);

  if (membership.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }

  await addSpaceMemberUseCase(space.spaceId, pendingUser.userId, pendingUser.name, pendingUser.image);
  updateTag(CACHE_TAGS.members(space.spaceId));
}
