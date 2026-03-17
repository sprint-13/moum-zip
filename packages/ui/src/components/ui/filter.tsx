import { ChevronDown, ListFilter } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import type * as React from "react";

type FilterSize = "large" | "small";

interface FilterProps extends React.ComponentProps<"button"> {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selected?: boolean;
  size?: FilterSize;
}

const filterStyles = {
  large: {
    leftIconClass: "[&_svg]:size-4.5",
    rightIconClass: "[&_svg]:size-4.25",
    rootClass: "px-2 py-1",
    textClass: "text-base leading-6 tracking-[-0.02em]",
  },
  small: {
    leftIconClass: "[&_svg]:size-4",
    rightIconClass: "[&_svg]:size-3.5",
    rootClass: "px-2 py-1",
    textClass: "text-sm leading-5 tracking-[-0.02em]",
  },
} satisfies Record<
  FilterSize,
  {
    leftIconClass: string;
    rightIconClass: string;
    rootClass: string;
    textClass: string;
  }
>;

const Filter = ({
  className,
  label,
  leftIcon,
  rightIcon,
  selected = false,
  size = "large",
  type,
  ...props
}: FilterProps) => {
  const { leftIconClass, rightIconClass, rootClass, textClass } = filterStyles[size];
  const resolvedLeftIcon = leftIcon === undefined ? <ListFilter strokeWidth={1.8} /> : leftIcon;
  const resolvedRightIcon = rightIcon === undefined ? <ChevronDown strokeWidth={1.8} /> : rightIcon;
  const resolvedAriaSelectedProps =
    props.role === "tab" ? { "aria-selected": props["aria-selected"] ?? selected } : undefined;

  return (
    <button
      data-selected={selected}
      className={cn(
        "inline-flex items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[selected=true]:text-foreground/70 [&_svg]:shrink-0 disabled:pointer-events-none disabled:opacity-50",
        rootClass,
        className,
      )}
      type={type ?? "button"}
      {...resolvedAriaSelectedProps}
      {...props}
    >
      {resolvedLeftIcon ? <span className={leftIconClass}>{resolvedLeftIcon}</span> : null}
      <span className={cn("font-medium whitespace-nowrap", textClass)}>{label}</span>
      {resolvedRightIcon ? <span className={rightIconClass}>{resolvedRightIcon}</span> : null}
    </button>
  );
};

export { Filter };
export type { FilterProps, FilterSize };
