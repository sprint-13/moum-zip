import { Dropdown, Filter, TabButton } from "@ui/components";

import type {
  SpaceSearchCategory,
  SpaceSearchDateSortId,
  SpaceSearchDeadlineSortId,
  SpaceSearchFilter,
  SpaceSearchLocationId,
  SpaceSearchQueryState,
} from "../model/types";

interface SpaceSearchToolbarProps {
  categories: SpaceSearchCategory[];
  filters: SpaceSearchFilter[];
  onCategoryChange: (categoryId: SpaceSearchCategory["id"]) => void;
  onDateSortChange: (dateSortId: SpaceSearchDateSortId) => void;
  onDeadlineSortChange: (deadlineSortId: SpaceSearchDeadlineSortId) => void;
  onLocationChange: (locationId: SpaceSearchLocationId) => void;
  selectedCategoryId: SpaceSearchQueryState["categoryId"];
  selectedDateSortId: SpaceSearchQueryState["dateSortId"];
  selectedDeadlineSortId: SpaceSearchQueryState["deadlineSortId"];
  selectedLocationId: SpaceSearchQueryState["locationId"];
}

const getSelectedFilterOptionId = (
  filterId: SpaceSearchFilter["id"],
  {
    selectedDateSortId,
    selectedDeadlineSortId,
    selectedLocationId,
  }: Pick<SpaceSearchToolbarProps, "selectedDateSortId" | "selectedDeadlineSortId" | "selectedLocationId">,
) => {
  if (filterId === "date") {
    return selectedDateSortId;
  }

  if (filterId === "location") {
    return selectedLocationId;
  }

  return selectedDeadlineSortId;
};

export const SpaceSearchToolbar = ({
  categories,
  filters,
  onCategoryChange,
  onDateSortChange,
  onDeadlineSortChange,
  onLocationChange,
  selectedCategoryId,
  selectedDateSortId,
  selectedDeadlineSortId,
  selectedLocationId,
}: SpaceSearchToolbarProps) => {
  const handleFilterChange = (filterId: SpaceSearchFilter["id"], optionId: string) => {
    if (filterId === "date") {
      onDateSortChange(optionId as SpaceSearchDateSortId);
      return;
    }

    if (filterId === "location") {
      onLocationChange(optionId as SpaceSearchLocationId);
      return;
    }

    onDeadlineSortChange(optionId as SpaceSearchDeadlineSortId);
  };

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
        {filters.map((filter) => {
          const defaultOption = filter.options[0];
          const selectedOptionId = getSelectedFilterOptionId(filter.id, {
            selectedDateSortId,
            selectedDeadlineSortId,
            selectedLocationId,
          });
          const selectedOption = filter.options.find(({ id }) => id === selectedOptionId) ?? defaultOption;

          return (
            <Dropdown key={filter.id}>
              <Dropdown.Trigger>
                <Filter
                  className="text-sm"
                  label={selectedOption.label}
                  leftIcon={null}
                  selected={selectedOption.id !== defaultOption?.id}
                  size="small"
                />
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                {filter.options.map((option) => (
                  <Dropdown.Item key={option.id} onSelect={() => handleFilterChange(filter.id, option.id)}>
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          );
        })}
      </div>
    </section>
  );
};
