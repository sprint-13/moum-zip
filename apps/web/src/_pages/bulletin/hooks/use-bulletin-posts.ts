"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { PostCategory } from "@/entities/post";
import type { GetBulletinPostsResult } from "@/features/space/use-cases/get-bulletin-posts";
import { bulletinQueryKeys } from "../model/query-keys";

export async function fetchBulletinPosts(
  slug: string,
  opts: { page: number; filter?: PostCategory },
): Promise<GetBulletinPostsResult> {
  const params = new URLSearchParams({ page: String(opts.page) });
  if (opts.filter) params.set("category", opts.filter);

  const res = await fetch(`/api/spaces/${slug}/bulletin?${params.toString()}`);
  if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
  return res.json();
}

export function useBulletinPosts(slug: string, opts: { page: number; filter?: PostCategory }) {
  const queryClient = useQueryClient();

  // TODO: 개선하기 (react-query에서 페이지네이션 쓰면 프리페치 지원되지 않나?)
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: bulletinQueryKeys.list(slug, { page: opts.page + 1, filter: opts.filter }),
      queryFn: () => fetchBulletinPosts(slug, { page: opts.page + 1, filter: opts.filter }),
    });
  }, [opts.page, opts.filter, slug, queryClient]);

  return useSuspenseQuery({
    queryKey: bulletinQueryKeys.list(slug, opts),
    queryFn: () => fetchBulletinPosts(slug, opts),
  });
}
