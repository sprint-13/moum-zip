import { Empty, Pagination } from "@ui/components";

import { SPACE_SEARCH_PAGINATION } from "../constants";
import type { SpaceSearchCardItem } from "../types";
import { SpaceCard } from "./space-card";

interface SpaceSearchResultsProps {
  items: SpaceSearchCardItem[];
}

export const SpaceSearchResults = ({ items }: SpaceSearchResultsProps) => {
  if (items.length === 0) {
    return (
      <section className="rounded-[2rem] bg-background-basic px-6 py-16">
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

      <div className="flex justify-center pt-2">
        <Pagination
          ariaLabel="스페이스 목록 페이지네이션"
          currentPage={SPACE_SEARCH_PAGINATION.currentPage}
          nextAriaLabel="다음 페이지"
          previousAriaLabel="이전 페이지"
          totalPages={SPACE_SEARCH_PAGINATION.totalPages}
        />
      </div>
    </section>
  );
};
