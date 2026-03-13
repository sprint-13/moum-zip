import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

// badge 종류가 5개이므로 shadcn 대신 피그마mcp 사용

const badgeVariants = cva(
  "inline-flex h-8 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border whitespace-nowrap text-sm leading-5",
  {
    variants: {
      variant: {
        scheduled: "border-transparent bg-[#dffaeb] px-3 font-semibold tracking-[-0.02em] text-[#009973]",
        waiting: "border-[#e5e7eb] bg-white px-3 font-medium text-[#6b7280]",
        completed: "border-transparent bg-[#edeff1] px-3 font-medium text-[#737373]",
        completedGradient:
          "border-transparent bg-linear-to-r from-[#def8ea] to-[#d9f6f4] px-3 font-medium text-[#737373]",
        confirmed:
          "border-[1.25px] border-transparent px-[0.5rem] pr-[0.75rem] font-medium text-[#009973] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#17DA71_0%,#08DDF0_100%)_border-box]",
      },
    },
    defaultVariants: {
      variant: "scheduled",
    },
  },
);

interface BadgeProps extends ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {}

interface BadgePresetProps extends Omit<BadgeProps, "children" | "variant"> {}

const CheckCircleIcon = () => {
  return (
    <span aria-hidden="true" className="relative size-6 overflow-hidden">
      <span className="absolute left-0.75 top-0.75 size-4.5 rounded-full bg-linear-to-r from-[#17DA71] to-[#08DDF0]" />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-6"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.4 12.15L10.6313 14.4L15.6 9.4"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
};

const Badge = ({ className, variant = "scheduled", children, ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "confirmed" ? (
        <>
          <CheckCircleIcon />
          <span className="font-medium">{children}</span>
        </>
      ) : (
        children
      )}
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
      개설확정
    </Badge>
  );
};

export { Badge, badgeVariants, CompletedBadge, CompletedGradientBadge, ConfirmedBadge, ScheduledBadge, WaitingBadge };
export type { BadgeProps };
