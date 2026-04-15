import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getSearchPrefetchContext } from "@/_pages/space-search/lib/get-search-prefetch-context";
import { getSearchCategories } from "@/_pages/space-search/use-cases/get-search-categories";
import { normalizeSearchQueryState, parseSearchQueryState, SearchContentSection } from "@/features/space-search";
import { SearchCreateButton } from "@/features/space-search/ui/space-search-create-button";
import { getQueryClient } from "@/shared/lib/get-query-client";

type SearchParams = Record<string, string | string[] | undefined>;

interface SearchPageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const queryState = parseSearchQueryState(resolvedSearchParams);
  const normalizedQueryState = normalizeSearchQueryState(queryState);
  const queryClient = getQueryClient();
  const { isAuthenticatedRequest, searchPrefetchQueryOptions } = await getSearchPrefetchContext({
    queryState: normalizedQueryState,
  });

  const [categories] = await Promise.all([
    getSearchCategories(),
    queryClient.prefetchInfiniteQuery(searchPrefetchQueryOptions),
  ]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full min-w-112.5 max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:max-w-6xl lg:gap-8 lg:pt-6.75 2xl:max-w-7xl">
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
            className="pointer-events-auto hidden sm:inline-flex lg:h-14 lg:min-w-43 lg:px-5 lg:text-lg 2xl:h-16 2xl:min-w-47 2xl:px-6 2xl:text-xl"
            isAuthenticated={isAuthenticatedRequest}
          >
            스페이스 만들기
          </SearchCreateButton>
        </div>
      </div>
    </div>
  );
}
