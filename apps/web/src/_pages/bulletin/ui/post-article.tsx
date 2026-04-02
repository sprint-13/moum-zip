"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CATEGORY_LABELS, type Post } from "@/entities/post";
import { useAlertModal } from "@/features/space/hooks/use-alert-modal";
import type { Requester } from "@/features/space/lib/assert-permission";
import { AlertModal } from "@/features/space/ui/alert-modal";
import { formatDate } from "@/shared/lib/date";
import { deletePostAction } from "../actions";

const CATEGORY_COLOR: Record<Post["category"], string> = {
  notice: "bg-blue-50 text-blue-600 border-blue-100",
  discussion: "bg-purple-50 text-purple-600 border-purple-100",
  question: "bg-amber-50 text-amber-600 border-amber-100",
  material: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

interface PostArticleProps {
  post: Post;
  slug: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

export function PostArticle({ post, slug, currentUserId, currentUserRole }: PostArticleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { open, openModal, closeModal } = useAlertModal();

  const canEdit = currentUserId === post.authorId || currentUserRole === "manager";

  function handleDelete() {
    closeModal();
    startTransition(async () => {
      await deletePostAction(slug, post.id);
      router.push(`/${slug}/bulletin`);
    });
  }

  return (
    <article
      className={`flex flex-col gap-6 rounded-xl border border-border bg-background p-6 ${isPending ? "opacity-50" : ""}`}
    >
      {/* 카테고리 + 날짜 + 수정/삭제 */}
      <div className="flex items-center justify-between">
        <span className={`rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${CATEGORY_COLOR[post.category]}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
        <div className="flex items-center gap-2">
          <time className="text-[12px] text-neutral-400">
            {formatDate(post.updatedAt ?? post.createdAt, "M월 d일")}
          </time>
          {canEdit && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => router.push(`/${slug}/bulletin/${post.id}/edit`)}
                disabled={isPending}
                className="rounded px-2 py-1 text-neutral-400 text-xs transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                수정
              </button>
              <button
                type="button"
                onClick={openModal}
                disabled={isPending}
                className="rounded px-2 py-1 text-red-400 text-xs transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 제목 */}
      <h1 className="font-bold text-2xl text-foreground leading-tight">{post.title}</h1>

      {/* 작성자 */}
      <div className="flex items-center gap-2 border-border border-b pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
          {post.author.name[0] ?? "-"}
        </div>
        <span className="font-medium text-neutral-700 text-sm">{post.author.name}</span>
      </div>

      {/* 본문 */}
      <div className="min-h-[200px] whitespace-pre-wrap text-[15px] text-neutral-800 leading-relaxed">
        {post.content}
      </div>

      <AlertModal
        open={open}
        message="해당 게시물을 삭제할까요?"
        description="지우면 복구 못해요"
        onAction={handleDelete}
        onCancel={closeModal}
      />
    </article>
  );
}
