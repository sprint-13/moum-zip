import type { PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";
import { NotFoundError, ValidationError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";
import { assertPermission, type Requester } from "../lib/assert-permission";

export interface UpdatePostInput {
  postId: string;
  spaceId: string;
  title: string;
  content: string;
  category: PostCategory;
}

/**
 * 게시글 수정 유스케이스.
 * - 작성자 또는 manager만 수정 가능
 * - 제목/본문 공백 검증
 */
export const updatePostUseCase = async (input: UpdatePostInput, requester: Requester): Promise<{ postId: string }> => {
  if (!input.title.trim()) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "제목을 입력해주세요.",
    });
  }

  if (!input.content.trim()) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "본문을 입력해주세요.",
    });
  }

  const rows = await postQueries.findById(input.postId);
  const post = rows[0]?.post;
  if (!post || post.spaceId !== input.spaceId) {
    throw new NotFoundError(ERROR_CODES.POST_NOT_FOUND);
  }

  assertPermission(post.authorId, requester);

  await postQueries.updateById(input.postId, {
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category,
  });

  return { postId: input.postId };
};
