"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CATEGORY_LABELS, type Post, type PostCategory } from "@/entities/post";
import { PostItem } from "./post-item";

interface BulletinTableProps {
  posts: Post[];
}

export const BulletinTable = ({ posts }: BulletinTableProps) => {
  const params = useParams<{ "space-slug": string }>();
  const slug = params["space-slug"];
  const [tab, setTab] = useState<PostCategory | null>(null);

  const filteredPosts = tab ? posts.filter((p) => p.category === tab) : posts;

  return (
    <div className="flex flex-col">
      {/* 탭 네비게이션 */}
      <div className="relative flex w-full rounded-t-lg border border-primary/20 border-b-border bg-background">
        {/* '전체' 탭 */}
        <button
          type="button"
          onClick={() => setTab(null)}
          className={`relative px-5 py-3 text-base transition-all duration-200 ${
            tab === null ? "font-bold text-primary" : "font-medium text-neutral-400 hover:text-neutral-600"
          }`}
        >
          전체
          {tab === null && <div className="absolute -bottom-px left-0 h-[2px] w-full bg-primary/40" />}
        </button>

        {/* 카테고리별 탭 */}
        {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setTab(category)}
            className={`relative px-5 py-3 text-base transition-all duration-200 ${
              tab === category ? "font-bold text-primary" : "font-medium text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {CATEGORY_LABELS[category]}
            {tab === category && <div className="absolute -bottom-px left-0 h-[2px] w-full bg-primary/40" />}
          </button>
        ))}
      </div>

      {/* 포스트 목록 */}
      <div className="flex flex-col gap-2 rounded-b-lg border border-primary/20 border-t-0 bg-background p-3 md:min-h-[350px]">
        {filteredPosts.length === 0 ? (
          <p className="my-auto py-4 text-center text-neutral-400 text-sm">등록된 게시글이 없습니다.</p>
        ) : (
          filteredPosts.slice(0, 4).map((post) => <PostItem key={post.id} post={post} slug={slug} />)
        )}
      </div>
    </div>
  );
};
