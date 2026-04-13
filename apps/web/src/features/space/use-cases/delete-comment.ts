import { commentQueries } from "@/entities/post/queries";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 댓글 삭제 유스케이스.
 * - 작성자 또는 manager만 삭제 가능
 * - DB에서 댓글 삭제 (트랜잭션: commentCount 동시 감소, GREATEST로 음수 방지)
 * - 존재하지 않는 댓글 삭제 시 에러
 */
export async function deleteCommentUseCase(
  commentId: string,
  postId: string,
  requester: Requester,
): Promise<{ commentId: string; authorId: number }> {
  const comment = await commentQueries.findById(commentId);
  if (!comment) throw new Error("댓글을 찾을 수 없습니다.");

  assertPermission(comment.authorId, requester);

  if (comment.postId !== postId) throw new Error("유효하지 않은 요청입니다.");

  await commentQueries.deleteById(commentId, postId);
  return { commentId, authorId: comment.authorId };
}
