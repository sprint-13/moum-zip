"use client";

import { useInfiniteSearchResults } from "../hooks/use-infinite-search-results";
import { useSearchQueryState } from "../hooks/use-search-query-state";
import { SEARCH_FILTERS } from "../model/constants";
import type { SearchCategory, SearchQueryState } from "../model/types";
import { SearchResults } from "./space-search-results";
import { SearchToolbar } from "./space-search-toolbar";

interface SearchContentSectionProps {
  categories: SearchCategory[];
  isAuthenticated: boolean;
  queryState: SearchQueryState;
}

export const SearchContentSection = ({ categories, isAuthenticated, queryState }: SearchContentSectionProps) => {
  const {
    activeQueryState,
    handleCategoryChange,
    handleDateSortChange,
    handleDeadlineSortChange,
    handleLocationChange,
  } = useSearchQueryState({ queryState });
  const { errorMessage, hasMore, items, loadMoreRef } = useInfiniteSearchResults({
    isAuthenticated,
    queryState: activeQueryState,
  });

  return (
    <>
      <div className="px-4 sm:px-0">
        <SearchToolbar
          categories={categories}
          filters={SEARCH_FILTERS}
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
        <SearchResults
          errorMessage={errorMessage}
          hasMore={hasMore}
          isAuthenticated={isAuthenticated}
          items={items}
          loadMoreRef={loadMoreRef}
        />
      </div>
    </>
  );
};
