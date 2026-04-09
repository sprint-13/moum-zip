import "server-only";

import type { SearchRequestQueryState } from "@/features/space-search/model/types";

import { getSearchMeetingsApi } from "./get-search-meetings-api";
import { getSearchPrefetchQueryOptions } from "./search-prefetch-query-options";

interface GetSearchPrefetchContextParams {
  queryState: SearchRequestQueryState;
}

export const getSearchPrefetchContext = async ({ queryState }: GetSearchPrefetchContextParams) => {
  const { isAuthenticatedRequest, meetingsApi } = await getSearchMeetingsApi();
  const searchPrefetchQueryOptions = getSearchPrefetchQueryOptions({
    isAuthenticatedRequest,
    meetingsApi,
    queryState,
  });

  return {
    isAuthenticatedRequest,
    searchPrefetchQueryOptions,
  };
};
