import { CreateButton } from "@ui/components";

import { SpaceSearchHeader, SpaceSearchHero } from "@/_pages/space-search";
import {
  parseSpaceSearchQueryState,
  SpaceSearchResultsSection,
  SpaceSearchToolbarSection,
} from "@/features/space-search";

type SpaceSearchParams = Record<string, string | string[] | undefined>;

interface SpacePageProps {
  searchParams?: Promise<SpaceSearchParams> | SpaceSearchParams;
}

export default async function SpacePage({ searchParams }: SpacePageProps) {
  const resolvedSearchParams = await searchParams;
  const queryState = parseSpaceSearchQueryState(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-background-secondary">
      <SpaceSearchHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6 pb-24 sm:px-6 lg:gap-8 lg:pt-6.75">
        <SpaceSearchHero />
        <div className="px-4 sm:px-0">
          <SpaceSearchToolbarSection queryState={queryState} />
        </div>
        <div className="px-4 sm:px-0">
          <SpaceSearchResultsSection queryState={queryState} />
        </div>
      </main>

      <div className="fixed right-4 bottom-6 z-20 sm:right-6 sm:bottom-8 xl:right-0 2xl:right-6">
        <CreateButton aria-label="스페이스 만들기" className="sm:hidden" variant="icon" />
        <CreateButton className="hidden sm:inline-flex">스페이스 만들기</CreateButton>
      </div>
    </div>
  );
}
