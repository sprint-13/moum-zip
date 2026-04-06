import type { InfiniteData } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { SearchHero } from "@/_pages/space-search";
import { getSearchMeetingsApi } from "@/_pages/space-search/lib/get-search-meetings-api";
import { getSearchCategories } from "@/_pages/space-search/use-cases/get-search-categories";
import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";
import type { SearchResultsResponse } from "@/entities/gathering";
import { normalizeSearchQueryState, parseSearchQueryState, SearchContentSection } from "@/features/space-search";
import { searchQueryKeys } from "@/features/space-search/model/query-keys";
import { SearchCreateButton } from "@/features/space-search/ui/space-search-create-button";
import { getQueryClient } from "@/shared/lib/get-query-client";

type SearchParams = Record<string, string | string[] | undefined>;

interface SpacePageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

export default async function SpacePage({ searchParams }: SpacePageProps) {
  const resolvedSearchParams = await searchParams;
  const queryState = parseSearchQueryState(resolvedSearchParams);
  const normalizedQueryState = normalizeSearchQueryState(queryState);
  const { isAuthenticatedRequest, meetingsApi } = await getSearchMeetingsApi();
  const queryClient = getQueryClient();
  const initialPageParam: string | null = null;

  const [categories] = await Promise.all([
    getSearchCategories(),
    queryClient.prefetchInfiniteQuery<
      SearchResultsResponse,
      Error,
      InfiniteData<SearchResultsResponse, string | null>,
      ReturnType<typeof searchQueryKeys.list>,
      string | null
    >({
      queryKey: searchQueryKeys.list(normalizedQueryState, isAuthenticatedRequest),
      queryFn: ({ pageParam }) =>
        getSearchResults(
          {
            ...normalizedQueryState,
            cursor: pageParam,
          },
          { isAuthenticatedRequest, meetingsApi },
        ),
      initialPageParam,
      getNextPageParam: (lastPage: SearchResultsResponse) => lastPage.nextCursor ?? undefined,
    }),
  ]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:max-w-6xl lg:gap-8 lg:pt-[1.6875rem] 2xl:max-w-7xl">
        <SearchHero />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SearchContentSection
            categories={categories}
            isAuthenticated={isAuthenticatedRequest}
            queryState={queryState}
          />
        </HydrationBoundary>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 sm:bottom-8">
        <div className="mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:max-w-6xl 2xl:max-w-7xl">
          <SearchCreateButton
            aria-label="스페이스 만들기"
            className="pointer-events-auto sm:hidden"
            isAuthenticated={isAuthenticatedRequest}
            variant="icon"
          />
          <SearchCreateButton
            className="pointer-events-auto hidden sm:inline-flex lg:h-14 lg:min-w-[172px] lg:px-5 lg:text-lg 2xl:h-16 2xl:min-w-[188px] 2xl:px-6 2xl:text-xl"
            isAuthenticated={isAuthenticatedRequest}
          >
            스페이스 만들기
          </SearchCreateButton>
        </div>
      </div>
    </div>
  );
}
