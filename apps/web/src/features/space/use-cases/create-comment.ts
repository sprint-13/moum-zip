import { commentQueries, postQueries } from "@/entities/post/queries";
import { createNotification } from "@/features/notification/use-cases/create-notification";
import { AppError } from "@/shared/lib/error";

export interface CreateCommentInput {
  postId: string;
  spaceId: string;
  authorId: number;
  authorName: string;
  content: string;
}

/**
 * 댓글 작성 유스케이스.
 * - 빈 내용 유효성 검사
 * - UUID 생성 후 DB 저장 (트랜잭션: commentCount 동시 증가)
 */
export async function createCommentUseCase(input: CreateCommentInput): Promise<{ commentId: string }> {
  const trimmedContent = input.content.trim();

  if (!trimmedContent) throw new Error("댓글 내용을 입력해주세요.");

  const postRows = await postQueries.findById(input.postId);
  const post = postRows[0];
  if (!post || post.post.spaceId !== input.spaceId) throw new AppError("POST_NOT_FOUND");

  const comment = await commentQueries.create({
    id: crypto.randomUUID(),
    postId: input.postId,
    spaceId: input.spaceId,
    authorId: input.authorId,
    content: trimmedContent,
  });

  const postAuthorId = post.author.id;

  if (postAuthorId && postAuthorId !== input.authorId) {
    await createNotification({
      teamId: input.spaceId,
      userId: postAuthorId,
      type: "COMMENT",
      message: "내 게시글에 새 댓글이 달렸어요.",
      data: {
        postId: input.postId,
        postTitle: post.post.title,
        commentId: comment.id,
        commentAuthorName: input.authorName,
        commentContent: trimmedContent,
      },
    });
  }

  return { commentId: comment.id };
}
