"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Author, Comment } from "@/entities/post";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";
import { bulletinQueryKeys } from "../model/query-keys";

export function useCreateComment(slug: string, postId: string, spaceId: string, currentAuthor: Author) {
  const queryClient = useQueryClient();
  const key = bulletinQueryKeys.comments(slug, postId);
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      await throwIfNotOk(res, {
        fallbackMessage: "댓글 작성에 실패했습니다.",
      });
      return res.json() as Promise<{ commentId: string }>;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Comment[]>(key);
      const optimistic: Comment = {
        id: `optimistic-${Date.now()}`,
        postId,
        spaceId,
        authorId: currentAuthor.id,
        author: currentAuthor,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      queryClient.setQueryData<Comment[]>(key, (old) => [...(old ?? []), optimistic]);
      return { prev };
    },
    onError: (_error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useUpdateComment(slug: string, postId: string) {
  const queryClient = useQueryClient();
  const key = bulletinQueryKeys.comments(slug, postId);
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      await throwIfNotOk(res, {
        fallbackMessage: "댓글 수정에 실패했습니다.",
      });
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Comment[]>(key);
      queryClient.setQueryData<Comment[]>(
        key,
        (old) => old?.map((c) => (c.id === commentId ? { ...c, content } : c)) ?? [],
      );
      return { prev };
    },
    onError: (_error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useDeleteComment(slug: string, postId: string) {
  const queryClient = useQueryClient();
  const key = bulletinQueryKeys.comments(slug, postId);
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        await throwIfNotOk(res, {
          fallbackMessage: "댓글 삭제에 실패했습니다.",
        });
      }
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Comment[]>(key);
      queryClient.setQueryData<Comment[]>(key, (old) => old?.filter((c) => c.id !== commentId) ?? []);
      return { prev };
    },
    onError: (_error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
