import { postQueries } from "@/entities/post/queries";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 게시글 삭제 유스케이스.
 * - 작성자 또는 manager만 삭제 가능
 * - 존재하지 않는 게시글 삭제 시 에러
 */
export async function deletePostUseCase(postId: string, requester: Requester): Promise<{ postId: string }> {
  const rows = await postQueries.findById(postId);
  const post = rows[0]?.post;
  if (!post) throw new Error("게시글을 찾을 수 없습니다.");

  assertPermission(post.authorId, requester);

  await postQueries.deleteById(postId);
  return { postId };
}
