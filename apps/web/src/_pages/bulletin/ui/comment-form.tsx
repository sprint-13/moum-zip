"use client";

import { useRef, useTransition } from "react";
import { createCommentAction } from "../actions";

// import type { Comment } from "@/entities/post";
// import type { OptimisticAction } from "./comment-list";

interface CommentFormProps {
  slug: string;
  postId: string;
  // optimisticUpdate: (action: OptimisticAction) => void;
}
// TODO: Optimstic하게 댓글 추가하려면 유저 정보 필요.
export function CommentForm({ slug, postId }: CommentFormProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = ref.current?.value.trim();
    if (!content) return;

    startTransition(async () => {
      // optimisticUpdate({type: "add", comment: });
      await createCommentAction(slug, postId, content);
      if (ref.current) ref.current.value = "";
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        ref={ref}
        ria-label="댓글 내용"
        placeholder="댓글을 입력하세요..."
        rows={3}
        disabled={isPending}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm transition-opacity disabled:opacity-50"
        >
          {isPending ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}

// function createOptimisticComment(content: string, postId: string, spaceId: string): Comment {
//   return {
//     id: crypto.randomUUID(),
//     postId,
//     spaceId,
//     authorId: 1
//     author: {id:1, name:'temp', image: null},
//     content,
//     createdAt: new Date(),
//     updatedAt: null,
//   };
// }
