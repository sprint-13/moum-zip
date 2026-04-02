"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { Member } from "@/entities/member";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { updateMemberProfileUseCase } from "./use-cases/update-member-profile";

export interface UpdateMemberProfileActionInput {
  avatarUrl?: string | null;
  email?: string | null;
  nickname?: string;
}

const revalidateSpaceProfile = (spaceId: string, slug: string) => {
  revalidateTag(`membership-${spaceId}`, "max");
  revalidateTag(`members-${spaceId}`, "max");
  revalidatePath(`/${slug}`);
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

  revalidateSpaceProfile(space.spaceId, slug);

  return { member };
}
