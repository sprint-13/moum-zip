import type { PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";
import { createSpaceMemberNotifications } from "@/features/notification/use-cases/create-space-member-notification";

export interface CreatePostInput {
  spaceId: string;
  authorId: number;
  category: PostCategory;
  title: string;
  content: string;
  image?: string;
}

/**
 * 게시글 작성.
 * 외부 API 없이 로컬 DB에 직접 저장한다.
 */
export async function createPostUseCase(input: CreatePostInput): Promise<{ postId: string }> {
  const id = crypto.randomUUID();

  await postQueries.create({
    id,
    spaceId: input.spaceId,
    authorId: input.authorId,
    category: input.category,
    title: input.title,
    content: input.content,
    image: input.image,
  });

  try {
    await createSpaceMemberNotifications({
      spaceId: input.spaceId,
      actorId: input.authorId,
      type: "SPACE_POST_CREATED",
      message: `새 게시글이 등록되었어요: ${input.title}`,
      data: {
        postId: id,
        postTitle: input.title,
        image: input.image ?? null,
      },
    });
  } catch (error) {
    // 알림 생성 실패가 게시글 작성 실패로 전파되지 않도록 분리
  }

  return { postId: id };
}
