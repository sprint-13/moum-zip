"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { applySearchFilter } from "./apply-search-filter";
import { buildSearchHref, parseSearchQueryState } from "./search-params";
import type { SearchDateSortId, SearchDeadlineSortId, SearchLocationId, SearchQueryState } from "./types";

type HistoryMode = "push" | "replace";

interface UseSearchQueryStateProps {
  queryState: SearchQueryState;
}

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

  const updateQueryState = (nextQueryState: SearchQueryState, historyMode: HistoryMode) => {
    setActiveQueryState(nextQueryState);
    updateBrowserQueryState(pathname, nextQueryState, historyMode);
  };

  const handleCategoryChange = (categoryId: SearchQueryState["categoryId"]) => {
    updateQueryState(applySearchFilter(activeQueryState, { type: "category", categoryId }), "push");
  };

  const handleDateSortChange = (dateSortId: SearchDateSortId) => {
    updateQueryState(applySearchFilter(activeQueryState, { type: "date-sort", dateSortId }), "replace");
  };

  const handleLocationChange = (locationId: SearchLocationId) => {
    updateQueryState(applySearchFilter(activeQueryState, { type: "location", locationId }), "replace");
  };

  const handleDeadlineSortChange = (deadlineSortId: SearchDeadlineSortId) => {
    updateQueryState(applySearchFilter(activeQueryState, { type: "deadline-sort", deadlineSortId }), "replace");
  };

  return {
    activeQueryState,
    handleCategoryChange,
    handleDateSortChange,
    handleDeadlineSortChange,
    handleLocationChange,
  };
};
