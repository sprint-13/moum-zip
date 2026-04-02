import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import type { Comment, Post } from "@/entities/post";
import { commentQueries, postQueries } from "@/entities/post/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";
export interface PostDetailResult {
  post: Post;
  comments: Comment[];
}

/**
 * 게시글 단건 + 댓글 목록 조회.
 */
const getCachedPostDetail = cache(async (postId: string): Promise<PostDetailResult> => {
  "use cache"; // Next.js 서버 캐시 (공유 및 지속성)
  cacheTag(CACHE_TAGS.post(postId));
  cacheLife("days");

  const [postRows, commentRows] = await Promise.all([
    postQueries.findById(postId),
    commentQueries.findManyByPostId(postId),
  ]);

  const row = postRows[0];
  if (!row) throw new Error("게시글을 찾을 수 없습니다.");

  const post: Post = { ...row.post, author: row.author };
  const comments: Comment[] = commentRows.map(({ comment, author }) => ({ ...comment, author }));

  return { post, comments };
});

// 2. UseCase 함수는 래핑된 캐시 함수를 호출만 합니다.
export async function getPostDetailUseCase(postId: string): Promise<PostDetailResult> {
  return getCachedPostDetail(postId);
}
