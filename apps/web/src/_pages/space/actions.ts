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

interface UpdateMemberProfileActionOptions {
  shouldRevalidate?: boolean;
}

const revalidateSpaceProfile = (spaceId: string, slug: string) => {
  revalidateTag(`membership-${spaceId}`, "max");
  revalidateTag(`members-${spaceId}`, "max");
  revalidatePath(`/${slug}`);
};

export async function updateMemberProfileAction(
  slug: string,
  input: UpdateMemberProfileActionInput,
  { shouldRevalidate = true }: UpdateMemberProfileActionOptions = {},
): Promise<{ member: Member }> {
  const { space, membership } = await getSpaceContext(slug);

  const member = await updateMemberProfileUseCase({
    avatarUrl: input.avatarUrl,
    email: input.email,
    nickname: input.nickname,
    spaceId: space.spaceId,
    userId: membership.userId,
  });

  if (shouldRevalidate) {
    revalidateSpaceProfile(space.spaceId, slug);
  }

  return { member };
}

export async function revalidateSpaceProfileAction(slug: string): Promise<void> {
  const { space } = await getSpaceContext(slug);
  revalidateSpaceProfile(space.spaceId, slug);
}
