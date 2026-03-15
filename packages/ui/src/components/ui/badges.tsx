import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, useId } from "react";

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

type StatusLabelSize = "large" | "small";

interface BadgeProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {}

interface BadgePresetProps extends Omit<BadgeProps, "children" | "variant"> {}

interface CheckCircleIconProps {
  size?: StatusLabelSize;
}

interface StatusLabelProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label?: string;
  size?: StatusLabelSize;
}

const CONFIRMED_LABEL = "개설확정"; // ConfirmedBadge와 StatusLabel이 고유하고 재사용성 없는 기본 문구를 공유하므로 상수로 분리함.

const statusLabelStyles = {
  large: {
    iconSizeClassName: "size-6",
    textClassName: "text-sm leading-5",
  },
  small: {
    iconSizeClassName: "size-4.5",
    textClassName: "text-xs leading-4",
  },
} satisfies Record<
  StatusLabelSize,
  {
    iconSizeClassName: string;
    textClassName: string;
  }
>;

const CheckCircleLargeIcon = () => {
  const gradientId = useId();

  return (
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
  );
};

const CheckCircleSmallIcon = () => {
  const gradientId = useId();

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7" fill={`url(#${gradientId})`} />
      <path
        d="M6 8.68421L8.2 11L12 7"
        stroke="var(--color-primary-foreground)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id={gradientId} x1="2" x2="16" y1="9" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary)" />
          <stop offset="1" stopColor="var(--color-secondary)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const checkCircleIconBySize = {
  large: CheckCircleLargeIcon,
  small: CheckCircleSmallIcon,
} satisfies Record<StatusLabelSize, typeof CheckCircleLargeIcon>;

const CheckCircleIcon = ({ size = "large" }: CheckCircleIconProps) => {
  const CheckCircle = checkCircleIconBySize[size];

  return (
    <span aria-hidden="true" className={statusLabelStyles[size].iconSizeClassName}>
      <CheckCircle />
    </span>
  );
};

const StatusLabel = ({ className, label = CONFIRMED_LABEL, size = "large", ...props }: StatusLabelProps) => {
  const { textClassName } = statusLabelStyles[size];

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} {...props}>
      <CheckCircleIcon size={size} />
      <span className={cn("font-medium whitespace-nowrap text-primary", textClassName)}>{label}</span>
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
      <StatusLabel />
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
export type { BadgeProps, StatusLabelProps, StatusLabelSize };
