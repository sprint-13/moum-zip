import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

const badgeVariants = cva("inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap", {
  variants: {
    container: {
      default: "h-8 rounded-[24px] border px-3 text-sm leading-5",
      none: "h-auto overflow-visible rounded-none border-0 bg-transparent p-0 text-sm leading-5",
    },
    variant: {
      completed: "font-medium text-muted-foreground",
      completedGradient: "font-medium text-muted-foreground",
      confirmed: "font-medium text-primary",
      scheduled: "font-semibold tracking-[-0.02em] text-accent",
      waiting: "font-medium text-muted-foreground",
    },
  },
  compoundVariants: [
    {
      container: "default",
      variant: "scheduled",
      className: "border-transparent bg-accent text-accent-foreground",
    },
    {
      container: "default",
      variant: "waiting",
      className: "border-border bg-background",
    },
    {
      container: "default",
      variant: "completed",
      className: "border-transparent bg-muted",
    },
    {
      container: "default",
      variant: "completedGradient",
      className: "border-transparent bg-linear-to-r from-accent to-muted",
    },
    {
      container: "default",
      variant: "confirmed",
      className:
        "border-[1.25px] border-transparent px-[0.5rem] pr-[0.75rem] [background:linear-gradient(var(--color-background),var(--color-background))_padding-box,var(--background-gradient)_border-box]",
    },
  ],
  defaultVariants: {
    container: "default",
    variant: "scheduled",
  },
});

interface BadgeProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {
  icon?: boolean | ReactNode;
  label?: ReactNode;
}

const CheckCircleIcon = () => {
  const gradientId = useId();

  return (
    <span aria-hidden="true" className="size-6">
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" fill={`url(#${gradientId})`} />
        <path
          d="M8.5 11.8245L11.0087 14.3333L15.342 10"
          stroke="var(--color-primary-foreground)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <defs>
          <linearGradient id={gradientId} x1="3" x2="21" y1="12" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-primary)" />
            <stop offset="1" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

const Badge = ({
  className,
  container = "default",
  icon = false,
  label,
  variant = "scheduled",
  children,
  ...props
}: BadgeProps) => {
  const resolvedLabel = label ?? children;
  const resolvedIcon = icon === true ? <CheckCircleIcon /> : icon || null;

  return (
    <span className={cn(badgeVariants({ container, variant }), resolvedIcon && "gap-0.5", className)} {...props}>
      {resolvedIcon}
      {resolvedLabel}
    </span>
  );
};

export { Badge, badgeVariants };
export type { BadgeProps };
