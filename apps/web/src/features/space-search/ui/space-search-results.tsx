import { Button, Empty } from "@ui/components";
import type { RefObject } from "react";

import { hasSearchKeywordConflict } from "../model/keyword-conflict-rule";
import type { SearchQueryState, SpaceCardItem } from "../model/types";
import { SpaceCard } from "./space-card";
import { SpaceCardSkeleton } from "./space-card-skeleton";

interface SearchResultsProps {
  errorMessage?: string;
  hasMore: boolean;
  isFetchingFirstPage: boolean;
  isFetchingNextPage: boolean;
  isAuthenticated: boolean;
  items: SpaceCardItem[];
  loadMoreRef: RefObject<HTMLDivElement | null>;
  onResetFiltersForKeyword: (keyword: string) => void;
  queryState: SearchQueryState;
}

export const SearchResults = ({
  errorMessage,
  hasMore,
  isFetchingFirstPage,
  isFetchingNextPage,
  isAuthenticated,
  items,
  loadMoreRef,
  onResetFiltersForKeyword,
  queryState,
}: SearchResultsProps) => {
  if (items.length === 0) {
    if (isFetchingFirstPage) {
      return (
        <section className="flex flex-col gap-8">
          <p aria-live="polite" className="sr-only">
            검색 결과를 불러오는 중이에요.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <SpaceCardSkeleton />
            <SpaceCardSkeleton />
            <SpaceCardSkeleton />
            <SpaceCardSkeleton />
          </div>
        </section>
      );
    }

    const hasKeywordConflict = !errorMessage && hasSearchKeywordConflict(queryState);

    if (hasKeywordConflict) {
      return (
        <section className="rounded-[2rem] px-6 py-16">
          <div className="flex flex-col items-center gap-6">
            <Empty
              label={`조건에 맞는 스페이스가 없어요.\n\n필터를 해제하고 "${queryState.keyword}"만 다시 검색해 보세요.`}
            />
            <Button
              size="small"
              type="button"
              variant="secondary"
              onClick={() => onResetFiltersForKeyword(queryState.keyword)}
            >
              필터 해제 후 "{queryState.keyword}"로 다시 검색
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="rounded-[2rem] px-6 py-16">
        <div className="flex justify-center">
          <Empty label={errorMessage ?? "조건에 맞는 스페이스가 없어요.\n다른 조건으로 다시 찾아보세요."} />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <SpaceCard isAuthenticated={isAuthenticated} item={item} key={item.id} />
        ))}
      </div>
      {errorMessage ? (
        <p className="text-center font-medium text-destructive text-sm leading-5">{errorMessage}</p>
      ) : null}
      {hasMore && !isFetchingNextPage ? <div aria-hidden="true" className="h-4 w-full" ref={loadMoreRef} /> : null}
      {isFetchingNextPage ? (
        <>
          <p aria-live="polite" className="sr-only">
            검색 결과를 더 불러오는 중이에요.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <SpaceCardSkeleton />
            <SpaceCardSkeleton />
          </div>
        </>
      ) : null}
      {!hasMore && !errorMessage && !isFetchingNextPage ? (
        <p className="text-center font-medium text-muted-foreground text-sm leading-5">더 이상 스페이스가 없어요.</p>
      ) : null}
    </section>
  );
};
