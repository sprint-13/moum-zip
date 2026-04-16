"use server";

import { updateTag } from "next/cache";
import { createNotification } from "@/features/notification/use-cases/create-notification";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { DomainError, ERROR_CODES } from "@/shared/lib/error";
import { handleAppError } from "@/shared/lib/handle-app-error";
import { addSpaceMemberUseCase, type PendingUser } from "./use-cases/add-space-member";

export const addSpaceMemberAction = async (slug: string, pendingUser: PendingUser) => {
  const { space, membership } = await getSpaceContext(slug).catch(handleAppError);

  if (membership.role !== "manager") {
    throw new DomainError(ERROR_CODES.FORBIDDEN, {
      message: "권한이 없습니다.",
    });
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
};
