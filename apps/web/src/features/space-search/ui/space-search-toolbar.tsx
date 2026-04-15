import { Dropdown, Filter, TabButton } from "@ui/components";
import { ChevronDown } from "@ui/icons";
import type { ReactNode } from "react";

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
  keywordBar?: ReactNode;
  onFilterOpenChange: (filterId: SearchFilter["id"], nextIsOpen: boolean) => void;
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

const CATEGORY_TAB_CLASS_NAME =
  "transition-[transform,background-color] duration-200 ease-out motion-reduce:transition-none lg:group-hover/tab:-translate-y-0.5 motion-reduce:lg:group-hover/tab:translate-y-0";
const FILTER_TRIGGER_CLASS_NAME =
  "cursor-pointer rounded-full text-sm transition-[background-color,border-color,color,box-shadow]";
const FILTER_CHEVRON_CLASS_NAME = "transition-transform duration-200 ease-out motion-reduce:transition-none";

const getFilterTriggerClassName = (isOpen: boolean, isSelected: boolean) => {
  return cn(
    FILTER_TRIGGER_CLASS_NAME,
    isOpen && !isSelected && "text-foreground/70",
    isSelected && "border border-primary/35 bg-primary/10 shadow-[inset_0_0_0_1px_rgba(31,95,76,0.02)]",
  );
};

const getFilterChevronClassName = (isOpen: boolean, isSelected: boolean) => {
  return cn(FILTER_CHEVRON_CLASS_NAME, isSelected && "text-primary", isOpen && "rotate-180");
};

export const SearchToolbar = ({
  categories,
  filters,
  keywordBar,
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
  const selectedFilterOptionIdById: Record<SearchFilter["id"], string> = {
    date: selectedDateSortId,
    deadline: selectedDeadlineSortId,
    location: selectedLocationId,
  };

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
    <section className="flex w-full min-w-112.5 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="no-scrollbar flex w-full min-w-112.5 flex-wrap items-center gap-2 overflow-x-hidden pb-1">
        {categories.map(({ id, label }) => (
          <div className="group/tab rounded-[1rem] p-0.5" key={id}>
            <TabButton
              aria-pressed={selectedCategoryId === id}
              className={cn(
                CATEGORY_TAB_CLASS_NAME,
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

      <div className="grid w-full min-w-112.5 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:flex lg:w-auto lg:items-center lg:justify-end">
        <div className="flex w-full min-w-112.5 flex-wrap items-center gap-x-1.5 gap-y-1 sm:justify-start lg:w-auto lg:justify-end">
          {filters.map((filter) => {
            const defaultOption = filter.options[0];
            const selectedOptionId = selectedFilterOptionIdById[filter.id];
            const selectedOption = filter.options.find(({ id }) => id === selectedOptionId) ?? defaultOption;
            const isOpen = openedFilterId === filter.id;
            const isSelected = selectedOption.id !== defaultOption?.id;

            return (
              <Dropdown
                key={filter.id}
                onOpenChange={(nextIsOpen) => onFilterOpenChange(filter.id, nextIsOpen)}
                open={isOpen}
              >
                <Dropdown.Trigger>
                  <Filter
                    className={getFilterTriggerClassName(isOpen, isSelected)}
                    label={selectedOption.label}
                    leftIcon={null}
                    rightIcon={
                      <ChevronDown className={getFilterChevronClassName(isOpen, isSelected)} strokeWidth={1.8} />
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

        {keywordBar ? <div className="flex w-full min-w-112.5 justify-end lg:hidden">{keywordBar}</div> : null}
      </div>
    </section>
  );
};
