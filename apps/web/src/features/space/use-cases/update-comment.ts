import { commentQueries } from "@/entities/post/queries";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 댓글 수정 유스케이스.
 * - 작성자 또는 manager만 수정 가능
 * - 빈 내용 검증
 */
export async function updateCommentUseCase(
  commentId: string,
  content: string,
  requester: Requester,
): Promise<{ commentId: string }> {
  if (!content.trim()) throw new Error("댓글 내용을 입력해주세요.");

  const comment = await commentQueries.findById(commentId);
  if (!comment) throw new Error("댓글을 찾을 수 없습니다.");

  assertPermission(comment.authorId, requester);

  await commentQueries.updateById(commentId, content.trim());
  return { commentId };
}
