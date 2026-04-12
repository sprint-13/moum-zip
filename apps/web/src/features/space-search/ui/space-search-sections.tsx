"use client";

import { useEffect, useState } from "react";

import { SearchHero } from "@/_pages/space-search";
import { useInfiniteSearchResults } from "../hooks/use-infinite-search-results";
import { useSearchQueryState } from "../hooks/use-search-query-state";
import { SEARCH_FILTERS } from "../model/constants";
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
    handleKeywordChange(draftKeyword);
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
    <div className="flex flex-col gap-4 lg:gap-6">
      <SearchHero
        desktopSearchBar={
          <SearchKeywordBar
            className="w-[31rem]"
            keyword={draftKeyword}
            onKeywordChange={setDraftKeyword}
            onSubmit={handleKeywordSubmit}
            searchStatus={keywordSearchStatus}
            variant="hero"
          />
        }
      />
      <div className="px-4 sm:px-0">
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
      </div>
      <div className="px-4 sm:px-0">
        <SearchResults
          errorMessage={errorMessage}
          hasMore={hasMore}
          isFetchingNextPage={isFetchingNextPage}
          isAuthenticated={isAuthenticated}
          items={items}
          loadMoreRef={loadMoreRef}
        />
      </div>
    </div>
  );
};
