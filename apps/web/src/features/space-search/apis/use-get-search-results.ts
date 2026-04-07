"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { SearchResultsResponse } from "@/entities/gathering";

import { searchQueryKeys } from "../model/query-keys";
import type { SearchRequestQueryState } from "../model/types";
import { getSearchResults } from "./get-search-results";

interface UseGetSearchResultsProps {
  isAuthenticated: boolean;
  queryState: SearchRequestQueryState;
}

export const useGetSearchResults = ({ isAuthenticated, queryState }: UseGetSearchResultsProps) => {
  const initialPageParam: string | null = null;

  return useInfiniteQuery<
    SearchResultsResponse,
    Error,
    InfiniteData<SearchResultsResponse, string | null>,
    ReturnType<typeof searchQueryKeys.list>,
    string | null
  >({
    queryKey: searchQueryKeys.list(queryState, isAuthenticated),
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
