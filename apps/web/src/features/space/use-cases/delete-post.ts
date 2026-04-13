import { postQueries } from "@/entities/post/queries";
import { AppError } from "@/shared/lib/error";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 게시글 삭제 유스케이스.
 * - 작성자 또는 manager만 삭제 가능
 * - 존재하지 않는 게시글 삭제 시 에러
 */
export async function deletePostUseCase(
  postId: string,
  spaceId: string,
  requester: Requester,
): Promise<{ postId: string; authorId: number }> {
  const rows = await postQueries.findById(postId);
  const post = rows[0]?.post;
  if (!post || post.spaceId !== spaceId) throw new AppError("POST_NOT_FOUND");

  assertPermission(post.authorId, requester);

  await postQueries.deleteById(postId);
  return { postId, authorId: post.authorId };
}
