"use client";

import { Eye, Heart, MessageSquare } from "@moum-zip/ui/icons";
import Link from "next/link";
import type { Post } from "@/entities/post";
import { formatDate } from "@/shared/lib/date";

const CATEGORY_MAP = {
  notice: { label: "공지", color: "bg-blue-50 text-blue-600 border-blue-100" },
  discussion: { label: "토론", color: "bg-purple-50 text-purple-600 border-purple-100" },
  question: { label: "질문", color: "bg-amber-50 text-amber-600 border-amber-100" },
  material: { label: "자료", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

interface PostItemProps {
  post: Post;
  slug: string;
}

export function PostItem({ post, slug }: PostItemProps) {
  const category = post.category ? CATEGORY_MAP[post.category] : null;
  const displayDate = post.updatedAt ?? post.createdAt;

  return (
    <div className={`$ relative`}>
      <Link
        href={`/${slug}/bulletin/${post.id}`}
        className="group block w-full cursor-pointer rounded-xl border border-primary/20 bg-background p-4 transition-all hover:shadow-xs"
      >
        <div className="flex flex-col gap-3">
          {/* 상단: 카테고리 및 날짜 */}
          <div className="flex items-center justify-between">
            {category && (
              <span className={`rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${category.color}`}>
                {category.label}
              </span>
            )}
            <time className="text-neutral-400 text-sm">{formatDate(displayDate)}</time>
          </div>

          {/* 중단: 제목 및 내용 */}
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-1 font-bold text-[16px] text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-[14px] text-neutral-600 leading-relaxed">{post.content}</p>
          </div>

          {/* 하단: 메타 정보 (좋아요, 조회수 등) */}
          <div className="flex items-center justify-between border-neutral-50 border-t pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-neutral-500">
                <Heart size={14} />
                <span className="font-medium text-[12px]">{post.likeCount}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-500">
                <MessageSquare size={14} />
                <span className="font-medium text-[12px]">{post.commentCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-400">
              <Eye size={14} />
              <span className="text-[12px]">{post.viewCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
