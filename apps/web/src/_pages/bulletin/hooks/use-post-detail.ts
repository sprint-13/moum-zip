"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Post } from "@/entities/post";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";
import { bulletinQueryKeys } from "../model/query-keys";

async function fetchPost(slug: string, postId: string): Promise<Post> {
  const res = await fetch(`/api/spaces/${slug}/bulletin/${postId}`);
  await throwIfNotOk(res, {
    fallbackMessage: "게시글을 불러오지 못했습니다.",
  });
  return res.json();
}

export function usePostDetail(slug: string, postId: string) {
  return useSuspenseQuery({
    queryKey: bulletinQueryKeys.detail(slug, postId),
    queryFn: () => fetchPost(slug, postId),
    staleTime: 1000 * 60,
  });
}
