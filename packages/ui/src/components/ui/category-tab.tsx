import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CategoryTabProps extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  illustration?: ReactNode;
  label: string;
  selected?: boolean;
}

const categoryTabStyles = {
  default: {
    contentClassName: "gap-1.5",
    rootClassName: "border-transparent bg-muted/60",
  },
  selected: {
    contentClassName: "gap-2",
    rootClassName: "border-primary bg-accent",
  },
} satisfies Record<
  "default" | "selected",
  {
    contentClassName: string;
    rootClassName: string;
  }
>;

const CategoryTab = ({ className, illustration, label, selected = false, type, ...props }: CategoryTabProps) => {
  const { contentClassName, rootClassName } = selected ? categoryTabStyles.selected : categoryTabStyles.default;
  const resolvedAriaPressed = props.role === "tab" ? undefined : (props["aria-pressed"] ?? selected);
  const resolvedAriaSelectedProps =
    props.role === "tab" ? { "aria-selected": props["aria-selected"] ?? selected } : undefined;

  return (
    <button
      aria-pressed={resolvedAriaPressed}
      className={cn(
        "inline-flex size-34 shrink-0 items-center justify-center overflow-hidden rounded-2xl border px-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        rootClassName,
        className,
      )}
      data-selected={selected}
      type={type ?? "button"}
      {...resolvedAriaSelectedProps}
      {...props}
    >
      <span className={cn("inline-flex flex-col items-center justify-center", contentClassName)}>
        <span aria-hidden="true" className="inline-flex size-20 shrink-0 items-center justify-center overflow-hidden">
          {illustration}
        </span>
        <span className="whitespace-nowrap font-medium text-[0.875rem] text-foreground/80 leading-5 tracking-[-0.02em]">
          {label}
        </span>
      </span>
    </button>
  );
};

export { CategoryTab };
export type { CategoryTabProps };
