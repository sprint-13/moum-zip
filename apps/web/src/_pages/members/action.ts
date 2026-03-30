"use server";

import { revalidateTag } from "next/cache";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";

export async function addSpaceMemberAction(slug: string, pendingUser: PendingUser) {
  const { space, membership } = await getSpaceContext(slug);

  if (membership.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }

  await addSpaceMemberUseCase(space.spaceId, pendingUser.userId, pendingUser.name, pendingUser.image);
  revalidateTag(`members-${space.spaceId}`, "max");
}
