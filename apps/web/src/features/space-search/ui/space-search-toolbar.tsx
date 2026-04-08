import { Dropdown, Filter, TabButton } from "@ui/components";

import type {
  SearchCategory,
  SearchDateSortId,
  SearchDeadlineSortId,
  SearchFilter,
  SearchLocationId,
  SearchQueryState,
} from "../model/types";

interface SearchToolbarProps {
  categories: SearchCategory[];
  filters: SearchFilter[];
  onCategoryChange: (categoryId: SearchCategory["id"]) => void;
  onDateSortChange: (dateSortId: SearchDateSortId) => void;
  onDeadlineSortChange: (deadlineSortId: SearchDeadlineSortId) => void;
  onLocationChange: (locationId: SearchLocationId) => void;
  selectedCategoryId: SearchQueryState["categoryId"];
  selectedDateSortId: SearchQueryState["dateSortId"];
  selectedDeadlineSortId: SearchQueryState["deadlineSortId"];
  selectedLocationId: SearchQueryState["locationId"];
}

const getSelectedFilterOptionId = (
  filterId: SearchFilter["id"],
  {
    selectedDateSortId,
    selectedDeadlineSortId,
    selectedLocationId,
  }: Pick<SearchToolbarProps, "selectedDateSortId" | "selectedDeadlineSortId" | "selectedLocationId">,
) => {
  if (filterId === "date") {
    return selectedDateSortId;
  }

  if (filterId === "location") {
    return selectedLocationId;
  }

  return selectedDeadlineSortId;
};

export const SearchToolbar = ({
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
}: SearchToolbarProps) => {
  const handleFilterChange = (filterId: SearchFilter["id"], optionId: string) => {
    if (filterId === "date") {
      onDateSortChange(optionId as SearchDateSortId);
      return;
    }

    if (filterId === "location") {
      onLocationChange(optionId as SearchLocationId);
      return;
    }

    onDeadlineSortChange(optionId as SearchDeadlineSortId);
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
