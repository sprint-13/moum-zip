"use client";

import { useEffect, useState } from "react";

import { SearchHero } from "@/_pages/space-search";
import { useInfiniteSearchResults } from "../hooks/use-infinite-search-results";
import { useSearchQueryState } from "../hooks/use-search-query-state";
import { SEARCH_FILTERS } from "../model/constants";
import { normalizeSearchKeyword } from "../model/search-params";
import type { SearchCategory, SearchFilter, SearchQueryState } from "../model/types";
import { SearchKeywordBar } from "./space-search-keyword-bar";
import { SearchResults } from "./space-search-results";
import { SearchToolbar } from "./space-search-toolbar";

interface SearchContentSectionProps {
  categories: SearchCategory[];
  isAuthenticated: boolean;
  queryState: SearchQueryState;
}

export const SearchContentSection = ({ categories, isAuthenticated, queryState }: SearchContentSectionProps) => {
  const [draftKeyword, setDraftKeyword] = useState(queryState.keyword);
  const [openedFilterId, setOpenedFilterId] = useState<SearchFilter["id"] | null>(null);
  const {
    activeQueryState,
    handleCategoryChange,
    handleDateSortChange,
    handleDeadlineSortChange,
    handleKeywordChange,
    handleLocationChange,
    handleResetFiltersForKeyword,
  } = useSearchQueryState({ queryState });
  const {
    errorMessage,
    hasMore,
    hasSearchQueryError,
    isFetched,
    isFetchingFirstPage,
    isFetchingNextPage,
    items,
    loadMoreRef,
  } = useInfiniteSearchResults({
    isAuthenticated,
    queryState: activeQueryState,
  });

  useEffect(() => {
    setDraftKeyword(activeQueryState.keyword);
  }, [activeQueryState.keyword]);

  const handleKeywordSubmit = () => {
    const normalizedKeyword = normalizeSearchKeyword(draftKeyword);

    setDraftKeyword(normalizedKeyword);
    handleKeywordChange(normalizedKeyword);
  };

  const keywordSearchStatus =
    activeQueryState.keyword.length === 0
      ? "idle"
      : isFetchingFirstPage
        ? "loading"
        : hasSearchQueryError
          ? "error"
          : isFetched
            ? "success"
            : "idle";

  const handleFilterOpenChange = (filterId: SearchFilter["id"], nextIsOpen: boolean) => {
    setOpenedFilterId((prevOpenedFilterId) => {
      if (nextIsOpen) {
        return filterId;
      }

      return prevOpenedFilterId === filterId ? null : prevOpenedFilterId;
    });
  };

  return (
    <div className="flex w-full min-w-80 flex-col gap-4 lg:gap-6">
      <SearchHero
        desktopSearchBar={
          <SearchKeywordBar
            className="w-124"
            keyword={draftKeyword}
            onKeywordChange={setDraftKeyword}
            onSubmit={handleKeywordSubmit}
            searchStatus={keywordSearchStatus}
            variant="hero"
          />
        }
      />
      <div className="flex w-full flex-1 flex-col gap-4 px-4 sm:px-0 lg:gap-6">
        <SearchToolbar
          categories={categories}
          filters={SEARCH_FILTERS}
          keywordBar={
            <SearchKeywordBar
              keyword={draftKeyword}
              onKeywordChange={setDraftKeyword}
              onSubmit={handleKeywordSubmit}
              searchStatus={keywordSearchStatus}
              variant="toolbar"
            />
          }
          onFilterOpenChange={handleFilterOpenChange}
          onCategoryChange={handleCategoryChange}
          onDateSortChange={handleDateSortChange}
          onDeadlineSortChange={handleDeadlineSortChange}
          onLocationChange={handleLocationChange}
          openedFilterId={openedFilterId}
          selectedCategoryId={activeQueryState.categoryId}
          selectedDateSortId={activeQueryState.dateSortId}
          selectedDeadlineSortId={activeQueryState.deadlineSortId}
          selectedLocationId={activeQueryState.locationId}
        />
        <SearchResults
          errorMessage={errorMessage}
          hasMore={hasMore}
          isFetchingFirstPage={isFetchingFirstPage}
          isFetchingNextPage={isFetchingNextPage}
          isAuthenticated={isAuthenticated}
          items={items}
          loadMoreRef={loadMoreRef}
          onResetFiltersForKeyword={handleResetFiltersForKeyword}
          queryState={activeQueryState}
        />
      </div>
    </div>
  );
};
