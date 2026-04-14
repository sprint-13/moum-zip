import { commentQueries, postQueries } from "@/entities/post/queries";
import { NotFoundError, ValidationError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";

export interface CreateCommentInput {
  postId: string;
  spaceId: string;
  authorId: number;
  content: string;
}

/**
 * 댓글 작성 유스케이스.
 * - 빈 내용 유효성 검사
 * - UUID 생성 후 DB 저장 (트랜잭션: commentCount 동시 증가)
 */
export const createCommentUseCase = async (input: CreateCommentInput): Promise<{ commentId: string }> => {
  if (!input.content.trim()) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "댓글 내용을 입력해주세요.",
    });
  }

  const postRows = await postQueries.findById(input.postId);
  const post = postRows[0];
  if (!post || post.post.spaceId !== input.spaceId) {
    throw new NotFoundError(ERROR_CODES.POST_NOT_FOUND);
  }

  const comment = await commentQueries.create({
    id: crypto.randomUUID(),
    postId: input.postId,
    spaceId: input.spaceId,
    authorId: input.authorId,
    content: input.content.trim(),
  });

  return { commentId: comment.id };
};
