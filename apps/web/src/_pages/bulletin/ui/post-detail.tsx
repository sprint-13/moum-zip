"use client";

import { Eye, Heart, MessageSquare } from "@moum-zip/ui/icons";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { CATEGORY_LABELS, type Comment, type Post } from "@/entities/post";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceCard } from "@/features/space";
import { useAlertModal } from "@/features/space/hooks/use-alert-modal";
import type { Requester } from "@/features/space/lib/assert-permission";
import { AlertModal } from "@/features/space/ui/alert-modal";
import { deleteCommentAction, deletePostAction, updateCommentAction } from "../actions";
import { CommentForm } from "./comment-form";

const CATEGORY_COLOR: Record<Post["category"], string> = {
  notice: "bg-blue-50 text-blue-600 border-blue-100",
  discussion: "bg-purple-50 text-purple-600 border-purple-100",
  question: "bg-amber-50 text-amber-600 border-amber-100",
  material: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

interface PostDetailProps {
  post: Post;
  comments: Comment[];
  slug: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

export function PostDetail({ post, comments, slug, currentUserId, currentUserRole }: PostDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { open, openModal, closeModal } = useAlertModal();

  const canEditPost = currentUserId === post.authorId || currentUserRole === "manager";

  function handleDeletePost() {
    startTransition(async () => {
      await deletePostAction(slug, post.id);
      router.push(`/${slug}/bulletin`);
    });
  }

  return (
    <SpaceBody>
      {/* ── Left: 본문 + 댓글 ── */}
      <SpaceBodyLeft>
        <article
          className={`flex flex-col gap-6 rounded-xl border border-border bg-background p-6 ${isPending ? "opacity-50" : ""}`}
        >
          {/* 카테고리 + 날짜 + 수정/삭제 */}
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${CATEGORY_COLOR[post.category]}`}
            >
              {CATEGORY_LABELS[post.category]}
            </span>
            <div className="flex items-center gap-2">
              <time className="text-[12px] text-neutral-400">
                {(post.updatedAt ?? post.createdAt)?.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {canEditPost && (
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
              {post.author.name[0]}
            </div>
            <span className="font-medium text-neutral-700 text-sm">{post.author.name}</span>
          </div>

          {/* 본문 */}
          <div className="min-h-[200px] whitespace-pre-wrap text-[15px] text-neutral-800 leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-bold text-base text-neutral-900">
            댓글 <span className="text-primary">{comments.length}</span>
          </h2>

          {comments.length > 0 ? (
            <ul className="flex flex-col divide-y divide-border">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  slug={slug}
                  postId={post.id}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                />
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-neutral-400 text-sm">첫 댓글을 남겨보세요.</p>
          )}

          <CommentForm slug={slug} postId={post.id} />
        </section>
        <AlertModal
          open={open}
          message="해당 게시물을 삭제할까요?"
          description="지우면 복구 못해요"
          onAction={handleDeletePost}
          onCancel={closeModal}
        />
      </SpaceBodyLeft>

      {/* ── Right: 게시글 정보 ── */}
      <SpaceBodyRight>
        <SpaceCard>
          <h3 className="mb-4 font-bold text-base text-neutral-900">게시글 정보</h3>
          <dl className="flex flex-col gap-3 text-sm">
            <InfoRow label="카테고리">
              <span
                className={`rounded-full border px-2 py-0.5 font-bold text-[11px] ${CATEGORY_COLOR[post.category]}`}
              >
                {CATEGORY_LABELS[post.category]}
              </span>
            </InfoRow>
            <InfoRow label="작성자">{post.author.name}</InfoRow>
            <InfoRow label="작성일">
              {post.createdAt?.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </InfoRow>
            <div className="mt-2 flex justify-around border-border border-t pt-3 text-neutral-500">
              <Stat icon={<Heart size={14} />} value={post.likeCount} />
              <Stat icon={<MessageSquare size={14} />} value={post.commentCount} />
              <Stat icon={<Eye size={14} />} value={post.viewCount} />
            </div>
          </dl>
        </SpaceCard>
      </SpaceBodyRight>
    </SpaceBody>
  );
}

interface CommentItemProps {
  comment: Comment;
  slug: string;
  postId: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

function CommentItem({ comment, slug, postId, currentUserId, currentUserRole }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isPending, startTransition] = useTransition();
  const { open, openModal, closeModal } = useAlertModal();

  const canEdit = currentUserId === comment.authorId || currentUserRole === "manager";

  function handleSave() {
    if (!editContent.trim()) return;
    startTransition(async () => {
      await updateCommentAction(slug, comment.id, postId, editContent.trim());
      setIsEditing(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteCommentAction(slug, comment.id, postId);
    });
  }

  return (
    <li className={`flex flex-col gap-1 py-4 ${isPending ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
          {comment.author.name[0]}
        </div>
        <span className="font-medium text-neutral-700 text-sm">{comment.author.name}</span>
        <time className="ml-auto text-[11px] text-neutral-400">
          {comment.createdAt?.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
        </time>
        {canEdit && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
              className="rounded px-2 py-0.5 text-neutral-400 text-xs transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              수정
            </button>
            <button
              type="button"
              onClick={openModal}
              disabled={isPending}
              className="rounded px-2 py-0.5 text-red-400 text-xs transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2 pl-9">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            disabled={isPending}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !editContent.trim()}
              className="rounded-lg bg-primary px-4 py-1.5 font-medium text-primary-foreground text-xs transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              disabled={isPending}
              className="rounded-lg border border-border px-4 py-1.5 font-medium text-neutral-600 text-xs transition-colors hover:bg-muted disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="pl-9 text-neutral-600 text-sm leading-relaxed">{comment.content}</p>
      )}
      <AlertModal open={open} message="해당 댓글을 지울까요?" onAction={handleDelete} onCancel={closeModal} />
    </li>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-700">{children}</dd>
    </div>
  );
}

function Stat({ icon, value }: { icon: ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-medium text-[12px]">{value}</span>
    </div>
  );
}
