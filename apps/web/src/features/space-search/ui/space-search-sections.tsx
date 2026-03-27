"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { SearchResultsResponse } from "@/entities/gathering";

import { useGetSearchResults } from "../apis/use-get-search-results";
import { SPACE_SEARCH_FILTERS, SPACE_SEARCH_INITIAL_QUERY_STATE } from "../model/constants";
import { mapSearchResultItemToSpaceCardItem } from "../model/result-mappers";
import { buildSpaceSearchHref, normalizeSearchQueryState, parseSpaceSearchQueryState } from "../model/search-params";
import type {
  SpaceSearchCategory,
  SpaceSearchDateSortId,
  SpaceSearchDeadlineSortId,
  SpaceSearchLocationId,
  SpaceSearchQueryState,
} from "../model/types";
import { SpaceSearchResults } from "./space-search-results";
import { SpaceSearchToolbar } from "./space-search-toolbar";

interface SpaceSearchSectionProps {
  queryState: SpaceSearchQueryState;
}

interface SpaceSearchToolbarSectionProps extends SpaceSearchSectionProps {
  categories: SpaceSearchCategory[];
}

interface SpaceSearchContentSectionProps extends SpaceSearchToolbarSectionProps {}

const useSpaceSearchUrlSync = () => {
  const pathname = usePathname();
  // 카테고리->pushState, 뒤로가기 시 저장. 필터->replaceState, 뒤로가기 시 저장x
  return {
    pushQueryState: (nextQueryState: SpaceSearchQueryState) => {
      window.history.pushState({}, "", buildSpaceSearchHref(pathname, nextQueryState));
    },
    replaceQueryState: (nextQueryState: SpaceSearchQueryState) => {
      window.history.replaceState({}, "", buildSpaceSearchHref(pathname, nextQueryState));
    },
  };
};

export const SpaceSearchContentSection = ({ categories, queryState }: SpaceSearchContentSectionProps) => {
  const { pushQueryState, replaceQueryState } = useSpaceSearchUrlSync();
  const [activeQueryState, setActiveQueryState] = useState<SpaceSearchQueryState>(queryState);

  useEffect(() => {
    const handlePopState = () => {
      setActiveQueryState(parseSpaceSearchQueryState(new URLSearchParams(window.location.search)));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleCategoryChange = (categoryId: SpaceSearchQueryState["categoryId"]) => {
    const nextQueryState = {
      ...activeQueryState,
      categoryId,
    };

    setActiveQueryState(nextQueryState);
    pushQueryState(nextQueryState);
  };

  const handleDateSortChange = (dateSortId: SpaceSearchDateSortId) => {
    const nextQueryState = {
      ...activeQueryState,
      dateSortId,
      deadlineSortId: SPACE_SEARCH_INITIAL_QUERY_STATE.deadlineSortId,
    };

    setActiveQueryState(nextQueryState);
    replaceQueryState(nextQueryState);
  };

  const handleLocationChange = (locationId: SpaceSearchLocationId) => {
    const nextQueryState = {
      ...activeQueryState,
      locationId,
    };

    setActiveQueryState(nextQueryState);
    replaceQueryState(nextQueryState);
  };

  const handleDeadlineSortChange = (deadlineSortId: SpaceSearchDeadlineSortId) => {
    const nextQueryState = {
      ...activeQueryState,
      dateSortId: SPACE_SEARCH_INITIAL_QUERY_STATE.dateSortId,
      deadlineSortId,
    };

    setActiveQueryState(nextQueryState);
    replaceQueryState(nextQueryState);
  };

  return (
    <>
      <div className="px-4 sm:px-0">
        <SpaceSearchToolbar
          categories={categories}
          filters={SPACE_SEARCH_FILTERS}
          onCategoryChange={handleCategoryChange}
          onDateSortChange={handleDateSortChange}
          onDeadlineSortChange={handleDeadlineSortChange}
          onLocationChange={handleLocationChange}
          selectedCategoryId={activeQueryState.categoryId}
          selectedDateSortId={activeQueryState.dateSortId}
          selectedDeadlineSortId={activeQueryState.deadlineSortId}
          selectedLocationId={activeQueryState.locationId}
        />
      </div>
      <div className="px-4 sm:px-0">
        <InfiniteSpaceSearchResults queryState={activeQueryState} />
      </div>
    </>
  );
};

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

const InfiniteSpaceSearchResults = ({ queryState }: SpaceSearchSectionProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingNextPageRef = useRef(false);
  const normalizedQueryState = normalizeSearchQueryState(queryState);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useGetSearchResults({
    queryState: normalizedQueryState,
  });
  const items = getUniqueSearchItems(data?.pages).map(mapSearchResultItemToSpaceCardItem);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetching || isFetchingNextPage;
  }, [isFetching, isFetchingNextPage]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isFetching || isFetchingNextPage) {
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
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  return <SpaceSearchResults hasMore={Boolean(hasNextPage)} items={items} loadMoreRef={loadMoreRef} />;
};
