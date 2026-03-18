import { Filter, TabButton } from "@ui/components";
import type { ComponentProps } from "react";

import type { SpaceSearchCategory, SpaceSearchFilter } from "../types";

interface SpaceSearchToolbarProps {
  categories: SpaceSearchCategory[];
  filters: SpaceSearchFilter[];
}

type FilterIconProps = Pick<ComponentProps<typeof Filter>, "leftIcon" | "rightIcon">;

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

export const SpaceSearchToolbar = ({ categories, filters }: SpaceSearchToolbarProps) => {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="no-scrollbar flex flex-wrap items-center gap-2 overflow-x-hidden pb-1">
        {categories.map(({ id, isActive, label }) => (
          <TabButton key={id} size="small" variant={isActive ? "active" : "default"}>
            {label}
          </TabButton>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1 lg:justify-end">
        {filters.map(({ hasLeftIcon, id, isSelected, label }) => {
          const { leftIcon, rightIcon } = getFilterIconProps({ hasLeftIcon, id });

          return (
            <Filter
              key={id}
              className="text-sm"
              label={label}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              selected={isSelected}
              size="small"
            />
          );
        })}
      </div>
    </section>
  );
};
