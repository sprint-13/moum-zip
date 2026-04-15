"use server";

import { updateTag } from "next/cache";
import type { MemberRole } from "@/entities/member";
import { memberQueries } from "@/entities/member";
import { createNotification } from "@/features/notification/use-cases/create-notification";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getGrassUseCase } from "@/features/space/use-cases/get-member-grass";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { handleAppError } from "@/shared/lib/handle-app-error";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";
import { changeRoleUseCase } from "./use-cases/change-role";
import { kickMemberUseCase } from "./use-cases/kick-member";

export async function addSpaceMemberAction(slug: string, pendingUser: PendingUser) {
  const { space, membership } = await getSpaceContext(slug).catch(handleAppError);

  if (membership.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }

  await addSpaceMemberUseCase(space.spaceId, pendingUser.userId, pendingUser.name, pendingUser.image);

  try {
    await createNotification({
      teamId: slug,
      userId: pendingUser.userId,
      type: "SPACE_MEMBER_ACCEPTED",
      message: `${space.name} 스페이스 가입이 승인되었어요.`,
      data: {
        spaceSlug: slug,
        image: pendingUser.image,
      },
    });
  } catch {
    // 알림 생성 실패가 멤버 승인 실패로 전파되지 않도록 분리
  }

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

export async function exportMembersAction(slug: string) {
  const { space, membership } = await getSpaceContext(slug);

  if (membership.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }

  const members = await memberQueries.findAllBySpaceId(space.spaceId);

  return members.map((m) => ({
    nickname: m.nickname,
    email: m.email ?? "-",
    role: m.role,
    joinedAt: m.joinedAt ?? "-",
    userId: m.userId,
  }));
}

export async function exportMemberGrassAction(slug: string, userId: number) {
  const { space } = await getSpaceContext(slug);
  const grass = await getGrassUseCase(space.spaceId, userId);
  return grass;
}
