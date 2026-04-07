import type { Comment, Post } from "@/entities/post";
import { commentQueries, postQueries } from "@/entities/post/queries";

export async function getPostInfo(postId: string): Promise<Post> {
  const postRows = await postQueries.findById(postId);
  const row = postRows[0];
  if (!row) throw new Error("게시글을 찾을 수 없습니다.");

  const post: Post = { ...row.post, author: row.author };

  return post;
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const commentRows = await commentQueries.findManyByPostId(postId);
  const comments: Comment[] = commentRows.map(({ comment, author }) => ({ ...comment, author }));

  return comments;
}
