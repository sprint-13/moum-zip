"use client";

import { usePathname, useRouter } from "next/navigation";

import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_FILTERS } from "../model/constants";
import { buildSpaceSearchHref, getSpaceSearchResultPage } from "../model/search-params";
import type { SpaceSearchQueryState } from "../model/types";
import { SpaceSearchResults } from "./space-search-results";
import { SpaceSearchToolbar } from "./space-search-toolbar";

interface SpaceSearchSectionProps {
  queryState: SpaceSearchQueryState;
}

const useSpaceSearchNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (nextQueryState: SpaceSearchQueryState) => {
    router.replace(buildSpaceSearchHref(pathname, nextQueryState));
  };
};

export const SpaceSearchToolbarSection = ({ queryState }: SpaceSearchSectionProps) => {
  const navigateWithQueryState = useSpaceSearchNavigation();

  const handleCategoryChange = (categoryId: SpaceSearchQueryState["categoryId"]) => {
    navigateWithQueryState({
      ...queryState,
      categoryId,
      page: 1,
    });
  };

  return (
    <SpaceSearchToolbar
      categories={SPACE_SEARCH_CATEGORIES}
      filters={SPACE_SEARCH_FILTERS}
      onCategoryChange={handleCategoryChange}
      selectedCategoryId={queryState.categoryId}
    />
  );
};

export const SpaceSearchResultsSection = ({ queryState }: SpaceSearchSectionProps) => {
  const navigateWithQueryState = useSpaceSearchNavigation();
  const resultPage = getSpaceSearchResultPage(queryState);

  const handlePageChange = (page: number) => {
    navigateWithQueryState({
      ...queryState,
      page,
    });
  };

  return (
    <SpaceSearchResults items={resultPage.items} onPageChange={handlePageChange} pagination={resultPage.pagination} />
  );
};
