"use client";

import { useOptimistic } from "react";
import type { Comment } from "@/entities/post";
import type { Requester } from "@/features/space/lib/assert-permission";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  comments: Comment[];
  slug: string;
  postId: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

// TODO: add 기능 구현 해야됨
export type OptimisticAction =
  | { type: "add"; comment: Comment }
  | { type: "update"; id: string; content: string }
  | { type: "delete"; id: string };

export function CommentList({ comments, slug, postId, currentUserId, currentUserRole }: CommentListProps) {
  const [optimisticComments, optimisticUpdate] = useOptimistic(comments, (state, action: OptimisticAction) => {
    switch (action.type) {
      case "add":
        return [...state, action.comment];
      case "update":
        return state.map((c) => (c.id === action.id ? { ...c, content: action.content } : c));
      case "delete":
        return state.filter((c) => c.id !== action.id);
    }
  });

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
      <h2 className="font-bold text-base text-neutral-900">
        댓글 <span className="text-primary">{comments.length}</span>
      </h2>

      {optimisticComments.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              optimisticUpdate={optimisticUpdate}
              slug={slug}
              postId={postId}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-neutral-400 text-sm">첫 댓글을 남겨보세요.</p>
      )}

      <CommentForm slug={slug} postId={postId} />
    </section>
  );
}
