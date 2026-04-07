"use client";

import { Button } from "@ui/components";
import Link from "next/link";
import type { ComponentProps } from "react";

import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { showRequiredToast } from "@/shared/lib/toast-utils";

interface SpaceCardJoinButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  isAuthenticated: boolean;
  meetingId: string;
}

const BUTTON_BASE_CLASS_NAME =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:pointer-events-none";

const BUTTON_VARIANT_CLASS_NAME = {
  primary: "bg-primary text-white hover:bg-green-600 disabled:bg-slate-100 disabled:text-slate-600",
  secondary: "border border-primary bg-white text-green-600 hover:bg-primary/10",
  tertiary: "bg-slate-200 text-slate-600 hover:bg-slate-300",
} as const;

const BUTTON_SIZE_CLASS_NAME = {
  small: "h-10 min-w-[83px] whitespace-nowrap px-4 text-sm",
  medium: "h-12 min-w-[311px] px-5 text-base",
  large: "h-[60px] min-w-[474px] px-6 text-xl",
} as const;

export const SpaceCardJoinButton = ({
  children,
  className,
  disabled,
  isAuthenticated,
  meetingId,
  size = "medium",
  variant = "primary",
  ...props
}: SpaceCardJoinButtonProps) => {
  const href = `${ROUTES.moimDetail}/${meetingId}`;

  const handleClick = () => {
    if (!isAuthenticated) {
      showRequiredToast("로그인 후 이용할 수 있어요.");
    }
  };

  if (!isAuthenticated || disabled) {
    return (
      <Button {...props} className={className} disabled={disabled} onClick={handleClick} size={size} variant={variant}>
        {children}
      </Button>
    );
  }

  return (
    <Link
      className={cn(
        BUTTON_BASE_CLASS_NAME,
        BUTTON_VARIANT_CLASS_NAME[variant],
        BUTTON_SIZE_CLASS_NAME[size],
        className,
      )}
      href={href}
      prefetch={false}
    >
      {children}
    </Link>
  );
};
