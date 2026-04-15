import type { PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";
import { ERROR_CODES, NotFoundError, ValidationError } from "@/shared/lib/error";
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

  const isContentEmpty = (() => {
    try {
      const doc = JSON.parse(input.content);
      const nodes: { content?: unknown[] }[] = doc?.content ?? [];
      return nodes.every((node) => !node.content || node.content.length === 0);
    } catch {
      return !input.content.trim();
    }
  })();

  if (isContentEmpty) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "본문을 입력해주세요.",
    });
  }

  const rows = await postQueries.findById(input.postId);
  const post = rows[0]?.post;
  if (!post || post.spaceId !== input.spaceId) {
    throw new NotFoundError(ERROR_CODES.POST_NOT_FOUND, {
      message: "게시글을 찾을 수 없습니다.",
    });
  }

  assertPermission(post.authorId, requester);

  await postQueries.updateById(input.postId, {
    title: input.title.trim(),
    content: input.content,
    category: input.category,
  });

  return { postId: input.postId };
};
