"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { PostCategory } from "@/entities/post";
import { likeQueries } from "@/entities/post/queries";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { createCommentUseCase } from "@/features/space/use-cases/create-comment";
import { createPostUseCase } from "@/features/space/use-cases/create-post";
import { deleteCommentUseCase } from "@/features/space/use-cases/delete-comment";
import { deletePostUseCase } from "@/features/space/use-cases/delete-post";
import { updateCommentUseCase } from "@/features/space/use-cases/update-comment";
import { updatePostUseCase } from "@/features/space/use-cases/update-post";

/**
 * 게시글 작성 Server Action.
 */
export async function createPostAction(slug: string, formData: FormData) {
  const { space, membership } = await getSpaceContext(slug);

  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");
  const image = formData.get("image");

  if (typeof title !== "string" || !title.trim()) throw new Error("제목을 입력해주세요.");
  if (typeof content !== "string" || !content.trim()) throw new Error("내용을 입력해주세요.");
  if (typeof category !== "string") throw new Error("카테고리를 선택해주세요.");

  const { postId } = await createPostUseCase({
    spaceId: space.spaceId,
    authorId: membership.userId,
    title: title.trim(),
    content: content.trim(),
    category: category as PostCategory,
    image: typeof image === "string" && image ? image : undefined,
  });

  revalidateTag(`bulletin-${space.spaceId}`, "max");
  revalidatePath(`/${slug}/bulletin`);
  return { postId };
}

/**
 * 게시글 수정 Server Action.
 */
export async function updatePostAction(slug: string, postId: string, formData: FormData) {
  const { space, membership } = await getSpaceContext(slug);

  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");

  if (typeof title !== "string" || !title.trim()) throw new Error("제목을 입력해주세요.");
  if (typeof content !== "string" || !content.trim()) throw new Error("내용을 입력해주세요.");
  if (typeof category !== "string") throw new Error("카테고리를 선택해주세요.");

  await updatePostUseCase(
    { postId, title, content, category: category as PostCategory },
    { userId: membership.userId, role: membership.role },
  );

  revalidateTag(`bulletin-${space.spaceId}`, "max");
  revalidatePath(`/${slug}/bulletin`);
  revalidatePath(`/${slug}/bulletin/${postId}`);
  return { postId };
}

/**
 * 게시글 삭제 Server Action.
 */
export async function deletePostAction(slug: string, postId: string) {
  const { space, membership } = await getSpaceContext(slug);

  await deletePostUseCase(postId, { userId: membership.userId, role: membership.role });

  revalidateTag(`bulletin-${space.spaceId}`, "max");
  revalidatePath(`/${slug}/bulletin`);
}

/**
 * 좋아요 토글 Server Action.
 * 서버에서 현재 상태를 확인 후 추가/취소한다.
 */
export async function toggleLikeAction(slug: string, postId: string) {
  const { membership } = await getSpaceContext(slug);
  const userId = membership.userId;

  const [existing] = await likeQueries.findByPostAndUser(postId, userId);

  if (existing) {
    await likeQueries.deleteByPostAndUser(postId, userId);
  } else {
    await likeQueries.create({ id: crypto.randomUUID(), postId, userId });
  }

  revalidatePath(`/${slug}/bulletin`);
}

/**
 * 댓글 작성 Server Action.
 */
export async function createCommentAction(slug: string, postId: string, content: string) {
  const { space, membership } = await getSpaceContext(slug);

  await createCommentUseCase({ postId, spaceId: space.spaceId, authorId: membership.userId, content });

  revalidatePath(`/${slug}/bulletin`);
  revalidatePath(`/${slug}/bulletin/${postId}`);
}

/**
 * 댓글 수정 Server Action.
 */
export async function updateCommentAction(slug: string, commentId: string, postId: string, content: string) {
  const { membership } = await getSpaceContext(slug);

  await updateCommentUseCase(commentId, content, { userId: membership.userId, role: membership.role });

  revalidatePath(`/${slug}/bulletin/${postId}`);
}

/**
 * 댓글 삭제 Server Action.
 */
export async function deleteCommentAction(slug: string, commentId: string, postId: string) {
  const { membership } = await getSpaceContext(slug);

  await deleteCommentUseCase(commentId, postId, { userId: membership.userId, role: membership.role });

  revalidatePath(`/${slug}/bulletin`);
  revalidatePath(`/${slug}/bulletin/${postId}`);
}
