import type { PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";

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

  return { postId: id };
}
