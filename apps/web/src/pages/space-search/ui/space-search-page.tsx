"use client";

import { CreateButton } from "@ui/components";

import { SPACE_SEARCH_CATEGORIES, SPACE_SEARCH_FILTERS, SPACE_SEARCH_ITEMS } from "../constants";
import { SpaceSearchHeader } from "./space-search-header";
import { SpaceSearchHero } from "./space-search-hero";
import { SpaceSearchResults } from "./space-search-results";
import { SpaceSearchToolbar } from "./space-search-toolbar";

// Use fallback tokens until design tokens are finalized.
const pageSurfaceClassName = "bg-background-basic";

export const SpaceSearchPage = () => {
  return (
    <div className={`min-h-screen ${pageSurfaceClassName}`}>
      <SpaceSearchHeader pageSurfaceClassName={pageSurfaceClassName} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:gap-8 lg:pt-6.75">
        <SpaceSearchHero />
        <div className="px-4 sm:px-0">
          <SpaceSearchToolbar categories={SPACE_SEARCH_CATEGORIES} filters={SPACE_SEARCH_FILTERS} />
        </div>
        <div className="px-4 sm:px-0">
          <SpaceSearchResults items={SPACE_SEARCH_ITEMS} />
        </div>
      </main>

      <div className="fixed right-4 bottom-6 z-20 sm:right-6 sm:bottom-8 xl:right-0 2xl:right-6">
        <CreateButton aria-label="Create space" className="sm:hidden" variant="icon" />
        <CreateButton className="hidden sm:inline-flex">스페이스 만들기</CreateButton>
      </div>
    </div>
  );
};
