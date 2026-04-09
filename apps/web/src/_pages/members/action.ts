"use server";

import { updateTag } from "next/cache";
import type { MemberRole } from "@/entities/member";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";
import { changeRoleUseCase } from "./use-cases/change-role";
import { kickMemberUseCase } from "./use-cases/kick-member";

export async function addSpaceMemberAction(slug: string, pendingUser: PendingUser) {
  const { space, membership } = await getSpaceContext(slug);

  if (membership.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }

  await addSpaceMemberUseCase(space.spaceId, pendingUser.userId, pendingUser.name, pendingUser.image);
  updateTag(CACHE_TAGS.members(space.spaceId));
}

export async function kickMemberAction(slug: string, targetUserId: number) {
  const { space, membership } = await getSpaceContext(slug);

  await kickMemberUseCase(space.spaceId, targetUserId, {
    userId: membership.userId,
    role: membership.role,
  });

  updateTag(CACHE_TAGS.members(space.spaceId));
}

export async function changeRoleAction(slug: string, targetUserId: number, newRole: MemberRole) {
  const { space, membership } = await getSpaceContext(slug);

  await changeRoleUseCase(space.spaceId, targetUserId, newRole, {
    userId: membership.userId,
    role: membership.role,
  });

  updateTag(CACHE_TAGS.members(space.spaceId));
  updateTag(CACHE_TAGS.member(space.spaceId, targetUserId));
}
