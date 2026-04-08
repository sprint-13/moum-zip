import type { Comment, Post } from "@/entities/post";
import { commentQueries, postQueries } from "@/entities/post/queries";
import { AppError } from "@/shared/lib/error";

export async function getPostInfo(postId: string, spaceId: string): Promise<Post> {
  const postRows = await postQueries.findById(postId);
  const row = postRows[0];
  if (!row || row.post.spaceId !== spaceId) throw new AppError("POST_NOT_FOUND");

  const post: Post = { ...row.post, author: row.author };

  return post;
}

export async function getPostComments(postId: string, spaceId: string): Promise<Comment[]> {
  const commentRows = await commentQueries.findManyByPostId(postId, spaceId);
  const comments: Comment[] = commentRows.map(({ comment, author }) => ({ ...comment, author }));

  return comments;
}
