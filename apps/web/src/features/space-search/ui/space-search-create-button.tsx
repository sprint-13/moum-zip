"use client";

import { Plus } from "@moum-zip/ui/icons";
import { CreateButton } from "@ui/components";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { showRequiredToast } from "@/shared/lib/toast-utils";

interface SearchCreateButtonProps extends ComponentProps<typeof CreateButton> {
  isAuthenticated: boolean;
}

type CreateButtonClickEvent = Parameters<NonNullable<SearchCreateButtonProps["onClick"]>>[0];

const CREATE_BUTTON_BASE_CLASS_NAME =
  "flex items-center justify-center bg-primary text-white transition-colors hover:bg-green-600";

const CREATE_BUTTON_CLASS_NAME = {
  full: "h-16 min-w-[188px] gap-2 rounded-[24px] px-6 font-bold text-xl",
  icon: "h-12 w-12 rounded-full",
} as const;

export const SearchCreateButton = ({
  "aria-label": ariaLabel,
  children,
  className,
  disabled,
  isAuthenticated,
  onClick,
  variant = "full",
  ...props
}: SearchCreateButtonProps) => {
  const handleClick: SearchCreateButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    showRequiredToast("로그인 후 이용할 수 있어요.");
  };

  if (!isAuthenticated || disabled) {
    return (
      <CreateButton {...props} className={className} disabled={disabled} onClick={handleClick} variant={variant}>
        {children}
      </CreateButton>
    );
  }

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event as unknown as CreateButtonClickEvent);
  };

  return (
    <Link
      aria-label={ariaLabel}
      className={cn(CREATE_BUTTON_BASE_CLASS_NAME, CREATE_BUTTON_CLASS_NAME[variant], className)}
      href={ROUTES.moimCreate}
      onClick={handleLinkClick}
    >
      <Plus size={32} aria-hidden="true" />
      {children}
    </Link>
  );
};
