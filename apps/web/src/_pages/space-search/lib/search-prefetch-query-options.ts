import "server-only";

import { infiniteQueryOptions } from "@tanstack/react-query";

import type { SearchResultsResponse } from "@/entities/gathering";
import { searchQueryKeys } from "@/features/space-search/model/query-keys";
import type { SearchRequestQueryState } from "@/features/space-search/model/types";

import { getSearchResults } from "../use-cases/get-search-results";
import type { getSearchMeetingsApi } from "./get-search-meetings-api";

type SearchMeetingsApi = Awaited<ReturnType<typeof getSearchMeetingsApi>>["meetingsApi"];

interface CreateSearchInfiniteQueryOptionsParams {
  isAuthenticatedRequest: boolean;
  meetingsApi: SearchMeetingsApi;
  queryState: SearchRequestQueryState;
}

export const getSearchPrefetchQueryOptions = ({
  isAuthenticatedRequest,
  meetingsApi,
  queryState,
}: CreateSearchInfiniteQueryOptionsParams) => {
  const initialPageParam: string | null = null;

  return infiniteQueryOptions({
    queryKey: searchQueryKeys.list(queryState, isAuthenticatedRequest),
    queryFn: ({ pageParam }) =>
      getSearchResults(
        {
          ...queryState,
          cursor: pageParam,
        },
        { isAuthenticatedRequest, meetingsApi },
      ),
    initialPageParam,
    getNextPageParam: (lastPage: SearchResultsResponse) => lastPage.nextCursor ?? undefined,
  });
};
