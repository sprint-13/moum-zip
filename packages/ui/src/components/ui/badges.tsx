import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

// badge 종류가 5개이므로 shadcn 대신 피그마mcp 사용

const badgeVariants = cva(
  "inline-flex h-8 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border whitespace-nowrap text-sm leading-5",
  {
    variants: {
      variant: {
        scheduled: "border-transparent bg-accent px-3 font-semibold tracking-[-0.02em] text-accent-foreground",
        waiting: "border-border bg-background px-3 font-medium text-muted-foreground",
        completed: "border-transparent bg-muted px-3 font-medium text-muted-foreground",
        completedGradient:
          "border-transparent bg-linear-to-r from-accent to-muted px-3 font-medium text-muted-foreground",
        confirmed:
          "border-[1.25px] border-transparent px-[0.5rem] pr-[0.75rem] [background:linear-gradient(var(--color-background),var(--color-background))_padding-box,var(--background-gradient)_border-box]",
      },
    },
    defaultVariants: {
      variant: "scheduled",
    },
  },
);

interface BadgeProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {}

interface BadgePresetProps extends Omit<BadgeProps, "children" | "variant"> {}

const statusLabelVariants = cva("inline-flex items-center gap-0.5", {
  variants: {
    size: {
      large: "",
      small: "",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

const statusLabelTextVariants = cva("font-medium whitespace-nowrap text-primary", {
  variants: {
    size: {
      large: "text-sm leading-5",
      small: "text-xs leading-4",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

const checkCircleIconVariants = cva("relative overflow-hidden shrink-0", {
  variants: {
    size: {
      large: "size-6",
      small: "size-4.5",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

const checkCircleGradientVariants = cva(
  "bg-background-gradient absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
  {
    variants: {
      size: {
        large: "size-4.5",
        small: "size-3.5",
      },
    },
    defaultVariants: {
      size: "large",
    },
  },
);

interface CheckCircleIconProps {
  size?: "large" | "small";
}

interface StatusLabelProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof statusLabelVariants> {}

const CheckCircleIcon = ({ size = "large" }: CheckCircleIconProps) => {
  return (
    <span aria-hidden="true" className={checkCircleIconVariants({ size })}>
      <span className={checkCircleGradientVariants({ size })} />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.4 12.15L10.6313 14.4L15.6 9.4"
          stroke="var(--color-primary-foreground)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
};

const StatusLabel = ({ className, size = "large", children, ...props }: StatusLabelProps) => {
  const statusLabelSize = size ?? "large";

  return (
    <span className={cn(statusLabelVariants({ size: statusLabelSize }), className)} {...props}>
      <CheckCircleIcon size={statusLabelSize} />
      <span className={statusLabelTextVariants({ size: statusLabelSize })}>{children}</span>
    </span>
  );
};

const Badge = ({ className, variant = "scheduled", children, ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};

const ScheduledBadge = (props: BadgePresetProps) => {
  return (
    <Badge variant="scheduled" {...props}>
      이용 예정
    </Badge>
  );
};

const WaitingBadge = (props: BadgePresetProps) => {
  return (
    <Badge variant="waiting" {...props}>
      개설대기
    </Badge>
  );
};

const CompletedBadge = (props: BadgePresetProps) => {
  return (
    <Badge variant="completed" {...props}>
      이용 완료
    </Badge>
  );
};

const CompletedGradientBadge = (props: BadgePresetProps) => {
  return (
    <Badge variant="completedGradient" {...props}>
      이용 완료
    </Badge>
  );
};

const ConfirmedBadge = (props: BadgePresetProps) => {
  return (
    <Badge variant="confirmed" {...props}>
      <StatusLabel>개설확정</StatusLabel>
    </Badge>
  );
};

export {
  Badge,
  badgeVariants,
  CompletedBadge,
  CompletedGradientBadge,
  ConfirmedBadge,
  ScheduledBadge,
  StatusLabel,
  WaitingBadge,
};
export type { BadgeProps, StatusLabelProps };
