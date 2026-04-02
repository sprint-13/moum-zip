"use server";

import { revalidateTag, updateTag } from "next/cache";
import type { Member } from "@/entities/member";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { updateMemberProfileUseCase } from "./use-cases/update-member-profile";

export interface UpdateMemberProfileActionInput {
  avatarUrl?: string | null;
  email?: string | null;
  nickname?: string;
}

const revalidateSpaceProfile = (spaceId: string, userId: number) => {
  updateTag(CACHE_TAGS.member(spaceId, userId));
  revalidateTag(CACHE_TAGS.bulletin(spaceId), "max"); // 게시글·댓글 작성자 닉네임/아바타 반영
};

export async function updateMemberProfileAction(
  slug: string,
  input: UpdateMemberProfileActionInput,
): Promise<{ member: Member }> {
  const { space, membership } = await getSpaceContext(slug);

  const member = await updateMemberProfileUseCase({
    avatarUrl: input.avatarUrl,
    email: input.email,
    nickname: input.nickname,
    spaceId: space.spaceId,
    userId: membership.userId,
  });

  revalidateSpaceProfile(space.spaceId, membership.userId);

  return { member };
}
