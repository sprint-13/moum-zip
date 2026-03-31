"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface UsePaginationUrlOptions<T extends string> {
  filterKey?: string;
  validFilters?: readonly T[];
}

interface UsePaginationUrlResult<T extends string> {
  page: number;
  filter: T | undefined;
  setPage: (page: number) => void;
  setFilter: (filter: T | undefined) => void;
}

/**
 * URL searchParams 기반 페이지네이션 상태 훅.
 * - setFilter 호출 시 page를 1로 자동 리셋
 * - 현재 searchParams를 유지하면서 page/filter만 변경
 */
export function usePaginationUrl<T extends string>(opts?: UsePaginationUrlOptions<T>): UsePaginationUrlResult<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const filterKey = opts?.filterKey ?? "category";

  const rawPage = searchParams.get("page");
  const page = Math.max(1, Number(rawPage) || 1);

  const rawFilter = searchParams.get(filterKey);
  const filter =
    rawFilter && opts?.validFilters
      ? opts.validFilters.includes(rawFilter as T)
        ? (rawFilter as T)
        : undefined
      : (rawFilter as T | undefined);

  function buildUrl(params: { page?: number; filter?: T | null }): string {
    const next = new URLSearchParams(searchParams.toString());

    if (params.page !== undefined) {
      next.set("page", String(params.page));
    }
    if ("filter" in params) {
      if (params.filter) {
        next.set(filterKey, params.filter);
      } else {
        next.delete(filterKey);
      }
    }

    return `?${next.toString()}`;
  }

  function setPage(newPage: number) {
    startTransition(() => router.push(buildUrl({ page: newPage })));
  }

  function setFilter(newFilter: T | undefined) {
    startTransition(() => router.push(buildUrl({ page: 1, filter: newFilter ?? null })));
  }

  return { page, filter, setPage, setFilter };
}
