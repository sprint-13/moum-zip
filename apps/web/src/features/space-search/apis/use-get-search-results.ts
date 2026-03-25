"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { SearchResultsResponse } from "@/entities/gathering";

import { spaceSearchQueryKeys } from "../model/query-keys";
import type { SearchResultsCategoryId } from "../model/search-params";
import { getSearchResults } from "./get-search-results";

interface UseGetSearchResultsProps {
  categoryId: SearchResultsCategoryId;
  initialResults: SearchResultsResponse;
}

export const useGetSearchResults = ({ categoryId, initialResults }: UseGetSearchResultsProps) => {
  const initialPageParam: string | null = null;

  return useInfiniteQuery<
    SearchResultsResponse,
    Error,
    InfiniteData<SearchResultsResponse, string | null>,
    ReturnType<typeof spaceSearchQueryKeys.list>,
    string | null
  >({
    queryKey: spaceSearchQueryKeys.list(categoryId),
    queryFn: ({ pageParam }) =>
      getSearchResults({
        categoryId,
        cursor: pageParam,
      }),
    initialData: {
      pageParams: [initialPageParam],
      pages: [initialResults],
    },
    initialPageParam,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
