"use client";

import { Pagination } from "@moum-zip/ui/components";
import { CATEGORY_LABELS, type PostCategory } from "@/entities/post";
import { useSpaceContext } from "@/features/space";
import { usePaginationUrl } from "@/shared/hooks/use-pagination-url";
import { useBulletinPosts } from "../hooks/use-bulletin-posts";
import { PostItem } from "./post-item";

const POST_CATEGORIES = Object.keys(CATEGORY_LABELS) as PostCategory[];

export const BulletinTable = () => {
  const { space } = useSpaceContext();

  const { page, filter, setPage, setFilter } = usePaginationUrl<PostCategory>({
    filterKey: "category",
    validFilters: POST_CATEGORIES,
  });

  const { data } = useBulletinPosts(space.slug, { page, filter });

  return (
    <div className="flex flex-col gap-2 px-3 pb-2">
      {/* 탭 네비게이션 */}
      <div className="relative mb-2 flex w-full rounded-t-lg border border-primary/20 border-b-border bg-background shadow-sm">
        <button
          type="button"
          onClick={() => setFilter(undefined)}
          className={`relative px-5 py-3 text-base transition-all duration-200 ${
            filter == null ? "font-bold text-primary" : "font-medium text-neutral-400 hover:text-neutral-600"
          }`}
        >
          전체
          {filter == null && <div className="absolute -bottom-px left-0 h-[2px] w-full bg-primary/40" />}
        </button>

        {POST_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`relative px-5 py-3 text-base transition-all duration-200 ${
              filter === category ? "font-bold text-primary" : "font-medium text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {CATEGORY_LABELS[category]}
            {filter === category && <div className="absolute -bottom-px left-0 h-[2px] w-full bg-primary/40" />}
          </button>
        ))}
      </div>

      {/* 포스트 목록 */}
      <div className="flex flex-col gap-2 rounded-lg rounded-t-none bg-background p-4 shadow-sm">
        {data.posts.length === 0 ? (
          <p className="py-4 text-center text-neutral-400 text-sm">등록된 게시글이 없습니다.</p>
        ) : (
          data.posts.map((post) => <PostItem key={post.id} post={post} slug={space.slug} />)
        )}
      </div>

      {/* 페이지네이션 */}
      {data.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            ariaLabel="게시판 페이지네이션"
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            previousAriaLabel="이전 페이지"
            nextAriaLabel="다음 페이지"
            size="responsive"
          />
        </div>
      )}
    </div>
  );
};
