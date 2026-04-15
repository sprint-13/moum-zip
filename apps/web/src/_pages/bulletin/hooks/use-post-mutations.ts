"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, PostCategory } from "@/entities/post";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";
import { bulletinQueryKeys } from "../model/query-keys";

export function useCreatePost(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { category: PostCategory; title: string; content: string; image?: string }) => {
      const res = await fetch(`/api/spaces/${slug}/bulletin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await throwIfNotOk(res, {
        fallbackMessage: "게시글 작성에 실패했습니다.",
      });
      return res.json() as Promise<{ postId: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulletinQueryKeys.all(slug) });
    },
  });
}

export function useUpdatePost(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { postId: string; category: PostCategory; title: string; content: string }) => {
      const { postId, ...rest } = body;
      const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      await throwIfNotOk(res, {
        fallbackMessage: "게시글 수정에 실패했습니다.",
      });
      return res.json() as Promise<{ postId: string }>;
    },
    onMutate: async ({ postId, title, content, category }) => {
      const queryKey = bulletinQueryKeys.detail(slug, postId);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Post>(queryKey);
      if (previous) {
        queryClient.setQueryData<Post>(queryKey, {
          ...previous,
          title,
          content,
          category,
          updatedAt: new Date(),
        });
      }
      return { previous, postId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(bulletinQueryKeys.detail(slug, context.postId), context.previous);
      }
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: bulletinQueryKeys.all(slug) });
      queryClient.invalidateQueries({ queryKey: bulletinQueryKeys.detail(slug, postId) });
    },
  });
}

export function useDeletePost(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        await throwIfNotOk(res, {
          fallbackMessage: "게시글 삭제에 실패했습니다.",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulletinQueryKeys.all(slug) });
    },
  });
}
