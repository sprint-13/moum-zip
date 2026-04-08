import { Dropdown, Filter, TabButton } from "@ui/components";
import { ChevronDown } from "@ui/icons";
import type { Dispatch, SetStateAction } from "react";

import { cn } from "@/shared/lib/cn";

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
  onFilterOpenChange: Dispatch<SetStateAction<SearchFilter["id"] | null>>;
  onCategoryChange: (categoryId: SearchCategory["id"]) => void;
  onDateSortChange: (dateSortId: SearchDateSortId) => void;
  onDeadlineSortChange: (deadlineSortId: SearchDeadlineSortId) => void;
  onLocationChange: (locationId: SearchLocationId) => void;
  openedFilterId: SearchFilter["id"] | null;
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
  onFilterOpenChange,
  onCategoryChange,
  onDateSortChange,
  onDeadlineSortChange,
  onLocationChange,
  openedFilterId,
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
          <div className="group/tab rounded-[1rem] p-0.5" key={id}>
            <TabButton
              aria-pressed={selectedCategoryId === id}
              className={cn(
                "transition-[transform,background-color] duration-200 ease-out motion-reduce:transition-none lg:group-hover/tab:-translate-y-0.5 motion-reduce:lg:group-hover/tab:translate-y-0",
                selectedCategoryId !== id && "bg-muted hover:bg-border-subtle",
                selectedCategoryId === id && "lg:-translate-y-0.5",
              )}
              onClick={() => onCategoryChange(id)}
              size="small"
              variant={selectedCategoryId === id ? "active" : "default"}
            >
              {label}
            </TabButton>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 lg:justify-end">
        {filters.map((filter) => {
          const defaultOption = filter.options[0];
          const selectedOptionId = getSelectedFilterOptionId(filter.id, {
            selectedDateSortId,
            selectedDeadlineSortId,
            selectedLocationId,
          });
          const selectedOption = filter.options.find(({ id }) => id === selectedOptionId) ?? defaultOption;
          const isOpen = openedFilterId === filter.id;
          const isSelected = selectedOption.id !== defaultOption?.id;

          return (
            <Dropdown
              key={filter.id}
              onOpenChange={(nextIsOpen) => {
                onFilterOpenChange((prevOpenedFilterId) => {
                  if (nextIsOpen) {
                    return filter.id;
                  }

                  return prevOpenedFilterId === filter.id ? null : prevOpenedFilterId;
                });
              }}
              open={isOpen}
            >
              <Dropdown.Trigger>
                <Filter
                  className={cn(
                    "cursor-pointer rounded-full text-sm transition-[background-color,border-color,color,box-shadow]",
                    isOpen && !isSelected && "cursor-pointer text-foreground/70",
                    isSelected && "border border-primary/35 bg-primary/10 shadow-[inset_0_0_0_1px_rgba(31,95,76,0.02)]",
                  )}
                  label={selectedOption.label}
                  leftIcon={null}
                  rightIcon={
                    <ChevronDown
                      className={cn(
                        "transition-transform duration-200 ease-out motion-reduce:transition-none",
                        isSelected && "text-primary",
                        isOpen && "rotate-180",
                      )}
                      strokeWidth={1.8}
                    />
                  }
                  selected={isSelected}
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
