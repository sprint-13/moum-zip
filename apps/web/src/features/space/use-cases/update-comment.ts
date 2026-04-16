import { commentQueries } from "@/entities/post/queries";
import { NotFoundError, ValidationError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";
import { assertPermission, type Requester } from "../lib/assert-permission";

/**
 * 댓글 수정 유스케이스.
 * - 작성자 또는 manager만 수정 가능
 * - 빈 내용 검증
 */
export const updateCommentUseCase = async (
  commentId: string,
  content: string,
  requester: Requester,
): Promise<{ commentId: string }> => {
  if (!content.trim()) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "댓글 내용을 입력해주세요.",
    });
  }

  const comment = await commentQueries.findById(commentId);
  if (!comment) {
    throw new NotFoundError(ERROR_CODES.COMMENT_NOT_FOUND, {
      message: "댓글을 찾을 수 없습니다.",
    });
  }

  assertPermission(comment.authorId, requester);

  await commentQueries.updateById(commentId, content.trim());
  return { commentId };
};
