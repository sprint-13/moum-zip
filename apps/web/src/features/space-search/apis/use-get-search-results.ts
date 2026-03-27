"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { SearchResultsResponse } from "@/entities/gathering";

import { spaceSearchQueryKeys } from "../model/query-keys";
import type { SearchResultsQueryState } from "../model/search-params";
import { getSearchResults } from "./get-search-results";

interface UseGetSearchResultsProps {
  queryState: SearchResultsQueryState;
}

export const useGetSearchResults = ({ queryState }: UseGetSearchResultsProps) => {
  const initialPageParam: string | null = null;

  return useInfiniteQuery<
    SearchResultsResponse,
    Error,
    InfiniteData<SearchResultsResponse, string | null>,
    ReturnType<typeof spaceSearchQueryKeys.list>,
    string | null
  >({
    queryKey: spaceSearchQueryKeys.list(queryState),
    queryFn: ({ pageParam }) =>
      getSearchResults({
        ...queryState,
        cursor: pageParam,
      }),
    initialPageParam,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: (previousData) => previousData,
  });
};
