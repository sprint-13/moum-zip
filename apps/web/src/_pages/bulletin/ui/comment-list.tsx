"use client";

import type { Author } from "@/entities/post";
import type { Requester } from "@/features/space/lib/assert-permission";
import { useComments } from "../hooks/use-comments";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  slug: string;
  postId: string;
  spaceId: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
  currentAuthor: Author;
}

export function CommentList({
  slug,
  postId,
  spaceId,
  currentUserId,
  currentUserRole,
  currentAuthor,
}: CommentListProps) {
  const { data: comments } = useComments(slug, postId);

  return (
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
              postId={postId}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-neutral-400 text-sm">첫 댓글을 남겨보세요.</p>
      )}

      <CommentForm slug={slug} postId={postId} spaceId={spaceId} currentAuthor={currentAuthor} />
    </section>
  );
}
