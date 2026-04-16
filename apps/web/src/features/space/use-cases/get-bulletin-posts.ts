import { cacheLife, cacheTag } from "next/cache";
import type { Post, PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

const PAGE_SIZE = 5;

export interface GetBulletinPostsResult {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 스페이스 게시판 목록 조회 (Next.js Data Cache 적용).
 * 게시글 작성/삭제 시 updateTag(CACHE_TAGS.bulletin(spaceId))로 무효화한다.
 * 글을 작성한 유저의 프로필 변경 시 revalidateTag(CACHE_TAGS.bulletin(spaceId), "max")로 무효화한다.
 */
export async function getBulletinPostsUseCase(
  spaceId: string,
  opts: { category?: PostCategory; page?: number } = {},
): Promise<GetBulletinPostsResult> {
  "use cache";
  cacheTag(CACHE_TAGS.bulletin(spaceId));
  cacheLife({ revalidate: 600, expire: 3600 });

  const page = opts.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  // COUNT(*) OVER() 윈도우 함수로 게시글 목록과 전체 수를 단일 쿼리로 조회
  const rows = await postQueries.findManyWithTotalBySpaceId(spaceId, {
    category: opts.category,
    limit: PAGE_SIZE,
    offset,
  });

  const total = rows[0]?.total ?? 0;
  const posts: Post[] = rows.map(({ post, author }) => ({ ...post, author }));

  return {
    posts,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
