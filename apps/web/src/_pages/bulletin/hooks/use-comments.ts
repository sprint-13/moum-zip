"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Comment } from "@/entities/post";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";
import { bulletinQueryKeys } from "../model/query-keys";

async function fetchComments(slug: string, postId: string): Promise<Comment[]> {
  const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}/comments`);
  await throwIfNotOk(res, {
    fallbackMessage: "댓글을 불러오지 못했습니다.",
  });
  return res.json();
}

export function useComments(slug: string, postId: string) {
  return useSuspenseQuery({
    queryKey: bulletinQueryKeys.comments(slug, postId),
    queryFn: () => fetchComments(slug, postId),
    staleTime: 1000 * 60,
  });
}
