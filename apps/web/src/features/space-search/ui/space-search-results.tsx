import { Empty } from "@ui/components";
import type { RefObject } from "react";

import type { SpaceCardItem } from "../model/types";
import { SpaceCard } from "./space-card";

interface SpaceSearchResultsProps {
  hasMore: boolean;
  items: SpaceCardItem[];
  loadMoreRef: RefObject<HTMLDivElement | null>;
}

export const SpaceSearchResults = ({ hasMore, items, loadMoreRef }: SpaceSearchResultsProps) => {
  if (items.length === 0) {
    return (
      <section className="rounded-[2rem] bg-background-secondary px-6 py-16">
        <div className="flex justify-center">
          <Empty label={"조건에 맞는 스페이스가 없어요.\n다른 조건으로 다시 찾아보세요."} />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-6 xl:grid-cols-2">
        {items.map((item) => (
          <SpaceCard item={item} key={item.id} />
        ))}
      </div>
      {hasMore ? <div aria-hidden="true" className="h-4 w-full" ref={loadMoreRef} /> : null}
    </section>
  );
};
