import type { Comment, Post } from "@/entities/post";
import { commentQueries, postQueries } from "@/entities/post/queries";

export interface PostDetailResult {
  post: Post;
  comments: Comment[];
}

/**
 * 게시글 단건 + 댓글 목록 조회.
 */
export async function getPostDetailUseCase(postId: string): Promise<PostDetailResult> {
  const [postRows, commentRows] = await Promise.all([
    postQueries.findById(postId),
    commentQueries.findManyByPostId(postId),
  ]);

  const row = postRows[0];
  if (!row) throw new Error("게시글을 찾을 수 없습니다.");

  const post: Post = { ...row.post, author: row.author };
  const comments: Comment[] = commentRows.map(({ comment, author }) => ({ ...comment, author }));

  return { post, comments };
}
