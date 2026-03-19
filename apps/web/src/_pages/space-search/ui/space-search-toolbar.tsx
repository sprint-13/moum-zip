import { Filter, TabButton } from "@ui/components";
import type { ComponentProps } from "react";

import type { SpaceSearchCategory, SpaceSearchFilter, SpaceSearchQueryState } from "../types";

interface SpaceSearchToolbarProps {
  categories: SpaceSearchCategory[];
  filters: SpaceSearchFilter[];
  onCategoryChange: (categoryId: SpaceSearchCategory["id"]) => void;
  selectedCategoryId: SpaceSearchQueryState["categoryId"];
}

type FilterIconProps = Pick<ComponentProps<typeof Filter>, "leftIcon" | "rightIcon">;

/**
 * - undefined: Filter 기본 아이콘 사용
 * - null: 해당 위치 아이콘 숨김
 */
const getFilterIconProps = ({ hasLeftIcon, id }: Pick<SpaceSearchFilter, "hasLeftIcon" | "id">): FilterIconProps => {
  if (id === "deadline") {
    return {
      leftIcon: undefined,
      rightIcon: null,
    };
  }

  if (hasLeftIcon) {
    return {
      leftIcon: undefined,
      rightIcon: undefined,
    };
  }

  return {
    leftIcon: null,
    rightIcon: undefined,
  };
};

export const SpaceSearchToolbar = ({
  categories,
  filters,
  onCategoryChange,
  selectedCategoryId,
}: SpaceSearchToolbarProps) => {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="no-scrollbar flex flex-wrap items-center gap-2 overflow-x-hidden pb-1">
        {categories.map(({ id, label }) => (
          <TabButton
            aria-pressed={selectedCategoryId === id}
            key={id}
            onClick={() => onCategoryChange(id)}
            size="small"
            variant={selectedCategoryId === id ? "active" : "default"}
          >
            {label}
          </TabButton>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1 lg:justify-end">
        {/* TODO: 날짜/지역/마감임박 필터 상호작용 추후 연결 예정. */}
        {filters.map(({ hasLeftIcon, id, label }) => {
          const { leftIcon, rightIcon } = getFilterIconProps({ hasLeftIcon, id });

          return (
            <Filter key={id} className="text-sm" label={label} leftIcon={leftIcon} rightIcon={rightIcon} size="small" />
          );
        })}
      </div>
    </section>
  );
};
