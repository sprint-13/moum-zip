import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type CountBadgeSize = "large" | "small";

interface CountBadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  count?: number;
  size?: CountBadgeSize;
}

const countBadgeStyles = {
  large: {
    rootClassName: "h-4 min-w-[1.25rem] rounded-[0.53125rem] px-[0.4375rem]",
    textClassName: "text-[0.75rem] leading-[1rem]",
  },
  small: {
    rootClassName: "h-3 min-w-3 rounded-[0.53125rem] px-[0.125rem]",
    textClassName: "text-[0.625rem] leading-[0.75rem]",
  },
} satisfies Record<
  CountBadgeSize,
  {
    rootClassName: string;
    textClassName: string;
  }
>;

const CountBadge = ({ className, count, size = "large", ...props }: CountBadgeProps) => {
  if (!count || count <= 0) {
    return null;
  }

  const { rootClassName, textClassName } = countBadgeStyles[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap bg-primary text-primary-foreground",
        rootClassName,
        className,
      )}
      {...props}
    >
      <span className={cn("font-semibold", textClassName)}>{count}</span>
    </span>
  );
};

export { CountBadge };
export type { CountBadgeProps, CountBadgeSize };
