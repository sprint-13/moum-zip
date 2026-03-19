"use client";

import { CreateButton } from "@ui/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_FILTERS } from "../constants";
import { buildSpaceSearchHref, getSpaceSearchResultPage, parseSpaceSearchQueryState } from "../search-params";
import type { SpaceSearchQueryState } from "../types";
import { SpaceSearchHeader } from "./space-search-header";
import { SpaceSearchHero } from "./space-search-hero";
import { SpaceSearchResults } from "./space-search-results";
import { SpaceSearchToolbar } from "./space-search-toolbar";

export const SpaceSearchPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryState = parseSpaceSearchQueryState(searchParams);
  const resultPage = getSpaceSearchResultPage(queryState);

  const navigateWithQueryState = (nextQueryState: SpaceSearchQueryState) => {
    router.replace(buildSpaceSearchHref(pathname, nextQueryState));
  };

  const handleCategoryChange = (categoryId: SpaceSearchQueryState["categoryId"]) => {
    navigateWithQueryState({
      ...queryState,
      categoryId,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    navigateWithQueryState({
      ...queryState,
      page,
    });
  };

  return (
    <div className="min-h-screen bg-background-basic">
      <SpaceSearchHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:gap-8 lg:pt-6.75">
        <SpaceSearchHero />
        <div className="px-4 sm:px-0">
          <SpaceSearchToolbar
            categories={SPACE_SEARCH_CATEGORIES}
            filters={SPACE_SEARCH_FILTERS}
            onCategoryChange={handleCategoryChange}
            selectedCategoryId={queryState.categoryId}
          />
        </div>
        <div className="px-4 sm:px-0">
          <SpaceSearchResults
            items={resultPage.items}
            onPageChange={handlePageChange}
            pagination={resultPage.pagination}
          />
        </div>
      </main>

      <div className="fixed right-4 bottom-6 z-20 sm:right-6 sm:bottom-8 xl:right-0 2xl:right-6">
        <CreateButton aria-label="Create space" className="sm:hidden" variant="icon" />
        <CreateButton className="hidden sm:inline-flex">스페이스 만들기</CreateButton>
      </div>
    </div>
  );
};
