"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getNextSearchQueryState } from "../model/next-search-query-state";
import { buildSearchHref, normalizeSearchKeyword, parseSearchQueryState } from "../model/search-params";
import type { SearchDateSortId, SearchDeadlineSortId, SearchLocationId, SearchQueryState } from "../model/types";

type HistoryMode = "push" | "replace";

interface UseSearchQueryStateProps {
  queryState: SearchQueryState;
}

type QueryStateUpdater = (currentQueryState: SearchQueryState) => SearchQueryState;

const updateBrowserQueryState = (pathname: string, nextQueryState: SearchQueryState, historyMode: HistoryMode) => {
  const nextHref = buildSearchHref(pathname, nextQueryState);

  if (historyMode === "push") {
    window.history.pushState({}, "", nextHref);
    return;
  }

  window.history.replaceState({}, "", nextHref);
};

export const useSearchQueryState = ({ queryState }: UseSearchQueryStateProps) => {
  const pathname = usePathname();
  const [activeQueryState, setActiveQueryState] = useState<SearchQueryState>(queryState);

  useEffect(() => {
    setActiveQueryState(queryState);
  }, [queryState]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveQueryState(parseSearchQueryState(new URLSearchParams(window.location.search)));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const updateQueryState = (updater: QueryStateUpdater, historyMode: HistoryMode) => {
    const nextQueryState = updater(activeQueryState);

    setActiveQueryState(nextQueryState);
    updateBrowserQueryState(pathname, nextQueryState, historyMode);
  };

  const handleCategoryChange = (categoryId: SearchQueryState["categoryId"]) => {
    updateQueryState(
      (currentQueryState) => getNextSearchQueryState(currentQueryState, { type: "category", categoryId }),
      "push",
    );
  };

  const handleDateSortChange = (dateSortId: SearchDateSortId) => {
    updateQueryState(
      (currentQueryState) => getNextSearchQueryState(currentQueryState, { type: "date-sort", dateSortId }),
      "replace",
    );
  };

  const handleLocationChange = (locationId: SearchLocationId) => {
    updateQueryState(
      (currentQueryState) => getNextSearchQueryState(currentQueryState, { type: "location", locationId }),
      "replace",
    );
  };

  const handleKeywordChange = (keyword: string) => {
    const normalizedKeyword = normalizeSearchKeyword(keyword);

    updateQueryState(
      (currentQueryState) =>
        getNextSearchQueryState(currentQueryState, { type: "keyword", keyword: normalizedKeyword }),
      "replace",
    );
  };

  const handleResetFiltersForKeyword = (keyword: string) => {
    const normalizedKeyword = normalizeSearchKeyword(keyword);

    updateQueryState(
      (currentQueryState) =>
        getNextSearchQueryState(currentQueryState, { type: "reset-filters-for-keyword", keyword: normalizedKeyword }),
      "replace",
    );
  };

  const handleDeadlineSortChange = (deadlineSortId: SearchDeadlineSortId) => {
    updateQueryState(
      (currentQueryState) => getNextSearchQueryState(currentQueryState, { type: "deadline-sort", deadlineSortId }),
      "replace",
    );
  };

  return {
    activeQueryState,
    handleCategoryChange,
    handleDateSortChange,
    handleDeadlineSortChange,
    handleKeywordChange,
    handleLocationChange,
    handleResetFiltersForKeyword,
  };
};
