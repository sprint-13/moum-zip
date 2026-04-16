"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { PostCategory } from "@/entities/post";
import type { GetBulletinPostsResult } from "@/features/space/use-cases/get-bulletin-posts";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";
import { bulletinQueryKeys } from "../model/query-keys";

export async function fetchBulletinPosts(
  slug: string,
  opts: { page: number; filter?: PostCategory },
): Promise<GetBulletinPostsResult> {
  const params = new URLSearchParams({ page: String(opts.page) });
  if (opts.filter) params.set("category", opts.filter);

  const res = await fetch(`/api/spaces/${slug}/bulletin?${params.toString()}`);
  await throwIfNotOk(res, {
    fallbackMessage: "게시글을 불러오지 못했습니다.",
  });
  return res.json();
}

export function useBulletinPosts(slug: string, opts: { page: number; filter?: PostCategory }) {
  return useSuspenseQuery({
    queryKey: bulletinQueryKeys.list(slug, opts),
    queryFn: () => fetchBulletinPosts(slug, opts),
  });
}
