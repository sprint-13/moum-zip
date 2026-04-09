"use client";

import { useEffect, useRef } from "react";

import type { SearchResultsResponse } from "@/entities/gathering";

import { mapSearchResultItemToSpaceCardItem } from "../model/result-mappers";
import { normalizeSearchQueryState } from "../model/search-params";
import type { SearchQueryState } from "../model/types";
import { useGetSearchResults } from "./use-get-search-results";

interface UseInfiniteSearchProps {
  isAuthenticated: boolean;
  queryState: SearchQueryState;
}

const getUniqueSearchItems = (results: SearchResultsResponse[] = []) => {
  const seenItemIds = new Set<string>();

  return results.flatMap((page) =>
    page.items.filter((item) => {
      if (seenItemIds.has(item.id)) {
        return false;
      }

      seenItemIds.add(item.id);
      return true;
    }),
  );
};

export const useInfiniteSearchResults = ({ isAuthenticated, queryState }: UseInfiniteSearchProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingNextPageRef = useRef(false);
  const normalizedQueryState = normalizeSearchQueryState(queryState);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetching,
    isFetchingNextPage,
    isRefetchError,
  } = useGetSearchResults({
    isAuthenticated,
    queryState: normalizedQueryState,
  });
  const hasQueryError = isError || isRefetchError || isFetchNextPageError;
  const errorMessage = hasQueryError ? "데이터를 불러오지 못했어요. 다시 시도해 주세요." : undefined;
  const items = getUniqueSearchItems(data?.pages).map(mapSearchResultItemToSpaceCardItem);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetching || isFetchingNextPage || hasQueryError;
  }, [hasQueryError, isFetching, isFetchingNextPage]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || hasQueryError || isFetching || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || isFetchingNextPageRef.current) {
          return;
        }

        isFetchingNextPageRef.current = true;
        void fetchNextPage();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, hasQueryError, isFetching, isFetchingNextPage]);

  return {
    errorMessage,
    hasMore: Boolean(hasNextPage && !hasQueryError),
    isFetchingNextPage,
    items,
    loadMoreRef,
  };
};
