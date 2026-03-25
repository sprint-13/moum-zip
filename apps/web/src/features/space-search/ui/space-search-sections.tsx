"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import type { SearchResultsResponse } from "@/entities/gathering";

import { useGetSearchResults } from "../apis/use-get-search-results";
import { SPACE_SEARCH_FILTERS } from "../model/constants";
import { mapSearchResultItemToSpaceCardItem } from "../model/result-mappers";
import { buildSpaceSearchHref, normalizeSearchCategoryId } from "../model/search-params";
import type { SpaceSearchCategory, SpaceSearchQueryState } from "../model/types";
import { SpaceSearchResults } from "./space-search-results";
import { SpaceSearchToolbar } from "./space-search-toolbar";

interface SpaceSearchSectionProps {
  queryState: SpaceSearchQueryState;
}

interface SpaceSearchToolbarSectionProps extends SpaceSearchSectionProps {
  categories: SpaceSearchCategory[];
}

interface SpaceSearchResultsSectionProps extends SpaceSearchSectionProps {
  initialResults: SearchResultsResponse;
}

const useSpaceSearchNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (nextQueryState: SpaceSearchQueryState) => {
    router.replace(buildSpaceSearchHref(pathname, nextQueryState));
  };
};

export const SpaceSearchToolbarSection = ({ categories, queryState }: SpaceSearchToolbarSectionProps) => {
  const navigateWithQueryState = useSpaceSearchNavigation();

  const handleCategoryChange = (categoryId: SpaceSearchQueryState["categoryId"]) => {
    navigateWithQueryState({
      ...queryState,
      categoryId,
    });
  };

  return (
    <SpaceSearchToolbar
      categories={categories}
      filters={SPACE_SEARCH_FILTERS}
      onCategoryChange={handleCategoryChange}
      selectedCategoryId={queryState.categoryId}
    />
  );
};

export const SpaceSearchResultsSection = ({ initialResults, queryState }: SpaceSearchResultsSectionProps) => {
  return (
    <InfiniteSpaceSearchResults
      initialResults={initialResults}
      key={normalizeSearchCategoryId(queryState.categoryId)}
      queryState={queryState}
    />
  );
};

const InfiniteSpaceSearchResults = ({ initialResults, queryState }: SpaceSearchResultsSectionProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetSearchResults({
    categoryId: normalizeSearchCategoryId(queryState.categoryId),
    initialResults,
  });
  const items = data.pages.flatMap((page) => page.items).map(mapSearchResultItemToSpaceCardItem);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        void fetchNextPage();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return <SpaceSearchResults hasMore={Boolean(hasNextPage)} items={items} loadMoreRef={loadMoreRef} />;
};
