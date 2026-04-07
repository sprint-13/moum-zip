"use client";

import { toast } from "@moum-zip/ui/components";
import { useState } from "react";
import type { Comment } from "@/entities/post";
import { useAlertModal } from "@/features/space/hooks/use-alert-modal";
import type { Requester } from "@/features/space/lib/assert-permission";
import { AlertModal } from "@/features/space/ui/alert-modal";
import { formatDate } from "@/shared/lib/date";
import { useDeleteComment, useUpdateComment } from "../hooks/use-comment-mutations";

interface CommentItemProps {
  comment: Comment;
  slug: string;
  postId: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

export function CommentItem({ comment, slug, postId, currentUserId, currentUserRole }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { open, openModal, closeModal } = useAlertModal();

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(slug, postId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(slug, postId);
  const isPending = isUpdating || isDeleting;

  const canEdit = currentUserId === comment.authorId || currentUserRole === "manager";

  function handleSave() {
    if (!editContent.trim()) return;
    updateComment(
      { commentId: comment.id, content: editContent.trim() },
      {
        onSuccess: () => setIsEditing(false),
        onError: () =>
          toast({
            message: "댓글 수정에 실패했습니다.",
            size: "small",
          }),
      },
    );
  }

  function handleDelete() {
    closeModal();
    deleteComment(comment.id, {
      onError: () =>
        toast({
          message: "댓글 삭제에 실패했습니다.",
          size: "small",
        }),
    });
  }

  return (
    <li className={`flex flex-col gap-1 py-4 ${isPending ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
          {comment.author.name[0]}
        </div>
        <span className="font-medium text-neutral-700 text-sm">{comment.author.name}</span>
        <time className="ml-auto text-[11px] text-neutral-400">{formatDate(comment.createdAt, "M월 d일")}</time>
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
              {isUpdating ? "저장 중..." : "저장"}
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
