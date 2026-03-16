import { ChevronLeft, ChevronRight, MoreHorizontal } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type PaginationSize = "large" | "responsive" | "small";

interface PaginationEllipsisItem {
  key: string;
  type: "ellipsis";
}

interface PaginationPageItem {
  key: string;
  page: number;
  type: "page";
}

type PaginationItem = PaginationEllipsisItem | PaginationPageItem;

interface PaginationProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  currentPage: number;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
  size?: PaginationSize;
  totalPages: number;
}

interface PaginationContentProps {
  currentPage: number;
  disabled: boolean;
  onPageChange?: (page: number) => void;
  size: Exclude<PaginationSize, "responsive">;
  totalPages: number;
  visibilityClassName?: string;
}

const paginationStyles = {
  large: {
    containerClassName: "gap-2.5",
    iconButtonClassName: "size-12",
    itemClassName: "size-12",
    itemContainerClassName: "gap-1",
    pageSlotCount: 7,
    textClassName: "text-base leading-6 tracking-[-0.02em]",
  },
  small: {
    containerClassName: "gap-2.5",
    iconButtonClassName: "size-8",
    itemClassName: "size-8",
    itemContainerClassName: "gap-1",
    pageSlotCount: 5,
    textClassName: "text-xs leading-4",
  },
} satisfies Record<
  Exclude<PaginationSize, "responsive">,
  {
    containerClassName: string;
    iconButtonClassName: string;
    itemClassName: string;
    itemContainerClassName: string;
    pageSlotCount: number;
    textClassName: string;
  }
>;

const clampPage = (page: number, totalPages: number) => {
  return Math.min(Math.max(page, 1), totalPages);
};

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const getPageItems = (start: number, end: number) => {
  return range(start, end).map((page) => ({
    key: `page-${page}`,
    page,
    type: "page",
  })) satisfies PaginationPageItem[];
};

const getPaginationItems = (currentPage: number, totalPages: number, pageSlotCount: number): PaginationItem[] => {
  if (totalPages <= pageSlotCount) {
    return getPageItems(1, totalPages);
  }

  const edgePageCount = pageSlotCount - 2;
  const middlePageCount = pageSlotCount - 4;
  const isStartRange = currentPage <= edgePageCount - 1;
  const isEndRange = currentPage >= totalPages - (edgePageCount - 2);

  if (isStartRange) {
    return [
      ...getPageItems(1, edgePageCount),
      { key: "ellipsis-end", type: "ellipsis" },
      ...getPageItems(totalPages, totalPages),
    ];
  }

  if (isEndRange) {
    return [
      ...getPageItems(1, 1),
      { key: "ellipsis-start", type: "ellipsis" },
      ...getPageItems(totalPages - edgePageCount + 1, totalPages),
    ];
  }

  const middlePageStart = currentPage - Math.floor(middlePageCount / 2);
  const middlePageEnd = middlePageStart + middlePageCount - 1;

  return [
    ...getPageItems(1, 1),
    { key: "ellipsis-start", type: "ellipsis" },
    ...getPageItems(middlePageStart, middlePageEnd),
    { key: "ellipsis-end", type: "ellipsis" },
    ...getPageItems(totalPages, totalPages),
  ];
};

const PaginationContent = ({
  currentPage,
  disabled,
  onPageChange,
  size,
  totalPages,
  visibilityClassName,
}: PaginationContentProps) => {
  if (totalPages <= 0) {
    return null;
  }

  const {
    containerClassName,
    iconButtonClassName,
    itemClassName,
    itemContainerClassName,
    pageSlotCount,
    textClassName,
  } = paginationStyles[size];
  const resolvedTotalPages = Math.max(totalPages, 1);
  const resolvedCurrentPage = clampPage(currentPage, resolvedTotalPages);
  const items = getPaginationItems(resolvedCurrentPage, resolvedTotalPages, pageSlotCount);
  const isPreviousDisabled = disabled || resolvedCurrentPage <= 1;
  const isNextDisabled = disabled || resolvedCurrentPage >= resolvedTotalPages;

  const handlePageChange = (page: number) => {
    if (disabled || page === resolvedCurrentPage || page < 1 || page > resolvedTotalPages) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className={cn("items-start", containerClassName, visibilityClassName)}>
      <button
        aria-label="Previous page"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:text-muted-foreground/40",
          iconButtonClassName,
        )}
        disabled={isPreviousDisabled}
        onClick={() => handlePageChange(resolvedCurrentPage - 1)}
        type="button"
      >
        <ChevronLeft className="size-6" strokeWidth={1.75} />
      </button>
      <div className={cn("inline-flex items-start", itemContainerClassName)}>
        {items.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded-lg text-muted-foreground/70",
                  itemClassName,
                )}
                key={item.key}
              >
                <MoreHorizontal className="size-6" strokeWidth={1.75} />
              </span>
            );
          }

          const isSelected = item.page === resolvedCurrentPage;

          return (
            <button
              aria-current={isSelected ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
                isSelected
                  ? "bg-accent text-primary hover:bg-accent"
                  : "text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground/80",
                itemClassName,
              )}
              key={item.key}
              onClick={() => handlePageChange(item.page)}
              type="button"
            >
              <span className={cn("tabular-nums", isSelected ? "font-bold" : "font-normal", textClassName)}>
                {item.page}
              </span>
            </button>
          );
        })}
      </div>
      <button
        aria-label="Next page"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:text-muted-foreground/40",
          iconButtonClassName,
        )}
        disabled={isNextDisabled}
        onClick={() => handlePageChange(resolvedCurrentPage + 1)}
        type="button"
      >
        <ChevronRight className="size-6" strokeWidth={1.75} />
      </button>
    </div>
  );
};

const Pagination = ({
  className,
  currentPage,
  disabled = false,
  onPageChange,
  size = "responsive",
  totalPages,
  ...props
}: PaginationProps) => {
  if (totalPages <= 0) {
    return null;
  }

  if (size === "responsive") {
    return (
      <nav aria-label="Pagination" className={cn("inline-flex items-start", className)} {...props}>
        <PaginationContent
          currentPage={currentPage}
          disabled={disabled}
          onPageChange={onPageChange}
          size="small"
          totalPages={totalPages}
          visibilityClassName="inline-flex sm:hidden"
        />
        <PaginationContent
          currentPage={currentPage}
          disabled={disabled}
          onPageChange={onPageChange}
          size="large"
          totalPages={totalPages}
          visibilityClassName="hidden sm:inline-flex"
        />
      </nav>
    );
  }

  return (
    <nav aria-label="Pagination" className={cn("inline-flex items-start", className)} {...props}>
      <PaginationContent
        currentPage={currentPage}
        disabled={disabled}
        onPageChange={onPageChange}
        size={size}
        totalPages={totalPages}
        visibilityClassName="inline-flex"
      />
    </nav>
  );
};

export { Pagination };
export type { PaginationProps, PaginationSize };
