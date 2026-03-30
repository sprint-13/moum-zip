import type { PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";
import { assertPermission, type Requester } from "../lib/assert-permission";

export interface UpdatePostInput {
  postId: string;
  title: string;
  content: string;
  category: PostCategory;
}

/**
 * 게시글 수정 유스케이스.
 * - 작성자 또는 manager만 수정 가능
 * - 제목/본문 공백 검증
 */
export async function updatePostUseCase(input: UpdatePostInput, requester: Requester): Promise<{ postId: string }> {
  if (!input.title.trim()) throw new Error("제목을 입력해주세요.");
  if (!input.content.trim()) throw new Error("본문을 입력해주세요.");

  const rows = await postQueries.findById(input.postId);
  const post = rows[0]?.post;
  if (!post) throw new Error("게시글을 찾을 수 없습니다.");

  assertPermission(post.authorId, requester);

  await postQueries.updateById(input.postId, {
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category,
  });

  return { postId: input.postId };
}
