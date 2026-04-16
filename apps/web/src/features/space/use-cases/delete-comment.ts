import { commentQueries } from "@/entities/post/queries";
import { DomainError, NotFoundError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 댓글 삭제 유스케이스.
 * - 작성자 또는 manager만 삭제 가능
 * - DB에서 댓글 삭제 (트랜잭션: commentCount 동시 감소, GREATEST로 음수 방지)
 * - 존재하지 않는 댓글 삭제 시 에러
 */
export const deleteCommentUseCase = async (
  commentId: string,
  postId: string,
  requester: Requester,
): Promise<{ commentId: string; authorId: number }> => {
  const comment = await commentQueries.findById(commentId);
  if (!comment) {
    throw new NotFoundError(ERROR_CODES.COMMENT_NOT_FOUND, {
      message: "댓글을 찾을 수 없습니다.",
    });
  }

  assertPermission(comment.authorId, requester);

  if (comment.postId !== postId) {
    throw new DomainError(ERROR_CODES.INVALID_REQUEST, {
      message: "유효하지 않은 요청입니다.",
    });
  }

  await commentQueries.deleteById(commentId, postId);
  return { commentId, authorId: comment.authorId };
};
