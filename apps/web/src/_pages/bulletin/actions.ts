"use server";

import { revalidateTag } from "next/cache";
import { likeQueries } from "@/entities/post/queries";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";

/**
 * 좋아요 토글 Server Action.
 * 서버에서 현재 상태를 확인 후 추가/취소한다.
 */
export async function toggleLikeAction(slug: string, postId: string) {
  const { space, membership } = await getSpaceContext(slug);
  const userId = membership.userId;

  const [existing] = await likeQueries.findByPostAndUser(postId, userId);

  if (existing) {
    await likeQueries.deleteByPostAndUser(postId, userId);
  } else {
    await likeQueries.create({ id: crypto.randomUUID(), postId, userId });
  }

  revalidateTag(CACHE_TAGS.bulletin(space.spaceId), "max");
}
