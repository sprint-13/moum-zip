import { unstable_cache } from "next/cache";
import type { Post, PostCategory } from "@/entities/post";
import { postQueries } from "@/entities/post/queries";

const PAGE_SIZE = 5;

export interface GetBulletinPostsResult {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchBulletinPosts(
  spaceId: string,
  opts: { category?: PostCategory; page?: number },
): Promise<GetBulletinPostsResult> {
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

/**
 * 스페이스 게시판 목록 조회 (Next.js Data Cache 적용).
 * 게시글 작성/삭제 시 revalidateTag(`bulletin-${spaceId}`)로 무효화한다.
 */
export function getBulletinPostsUseCase(
  spaceId: string,
  opts: { category?: PostCategory; page?: number } = {},
): Promise<GetBulletinPostsResult> {
  return unstable_cache(
    () => fetchBulletinPosts(spaceId, opts),
    ["bulletin-posts", spaceId, opts.category ?? "all", String(opts.page ?? 1)],
    { tags: [`bulletin-${spaceId}`], revalidate: 30 },
  )();
}
