"use client";

import { Plus } from "@moum-zip/ui/icons";
import { CreateButton } from "@ui/components";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

import { ROUTES } from "@/shared/config/routes";
import { showRequiredToast } from "@/shared/lib/toast-utils";

interface SearchCreateButtonProps {
  "aria-label"?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  isAuthenticated: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: "full" | "icon";
}

const renderCreateButtonContent = (children?: ReactNode) => {
  return (
    <>
      <Plus aria-hidden="true" className="size-8" />
      {children}
    </>
  );
};

export const SearchCreateButton = ({
  "aria-label": ariaLabel,
  children,
  className,
  disabled,
  isAuthenticated,
  onClick,
  variant = "full",
}: SearchCreateButtonProps) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    showRequiredToast("로그인 후 이용할 수 있어요.");
  };

  if (!isAuthenticated || disabled) {
    return (
      <CreateButton
        aria-label={ariaLabel}
        className={className}
        disabled={disabled}
        onClick={handleClick}
        variant={variant}
      >
        {children}
      </CreateButton>
    );
  }

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
  };

  return (
    <CreateButton aria-label={ariaLabel} asChild className={className} variant={variant}>
      <Link href={ROUTES.moimCreate} onClick={handleLinkClick}>
        {renderCreateButtonContent(children)}
      </Link>
    </CreateButton>
  );
};
