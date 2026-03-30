import type { InfiniteData } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { SpaceSearchHero } from "@/_pages/space-search";
import { getSearchMeetingsApi } from "@/_pages/space-search/lib/get-search-meetings-api";
import { getSearchCategories } from "@/_pages/space-search/use-cases/get-search-categories";
import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";
import type { SearchResultsResponse } from "@/entities/gathering";
import {
  normalizeSearchQueryState,
  parseSpaceSearchQueryState,
  SpaceSearchContentSection,
} from "@/features/space-search";
import { spaceSearchQueryKeys } from "@/features/space-search/model/query-keys";
import { SpaceSearchCreateButton } from "@/features/space-search/ui/space-search-create-button";
import { getQueryClient } from "@/shared/lib/get-query-client";

type SpaceSearchParams = Record<string, string | string[] | undefined>;

interface SpacePageProps {
  searchParams?: Promise<SpaceSearchParams> | SpaceSearchParams;
}

export default async function SpacePage({ searchParams }: SpacePageProps) {
  const resolvedSearchParams = await searchParams;
  const queryState = parseSpaceSearchQueryState(resolvedSearchParams);
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
      ReturnType<typeof spaceSearchQueryKeys.list>,
      string | null
    >({
      queryKey: spaceSearchQueryKeys.list(normalizedQueryState, isAuthenticatedRequest),
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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:gap-8 lg:pt-[1.6875rem]">
        <SpaceSearchHero />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SpaceSearchContentSection
            categories={categories}
            isAuthenticated={isAuthenticatedRequest}
            queryState={queryState}
          />
        </HydrationBoundary>
      </main>

      <div className="fixed right-4 bottom-6 z-20 sm:right-6 sm:bottom-8 xl:right-0 2xl:right-6">
        <SpaceSearchCreateButton aria-label="스페이스 만들기" className="sm:hidden" variant="icon" />
        <SpaceSearchCreateButton className="hidden sm:inline-flex">스페이스 만들기</SpaceSearchCreateButton>
      </div>
    </div>
  );
}
