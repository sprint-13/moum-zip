"use client";

import { Plus } from "@moum-zip/ui/icons";
import { CreateButton } from "@ui/components";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
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
  const createButtonClassName = cn(
    "border-0 shadow-[0_8px_18px_rgba(31,95,76,0.28)] transition-[transform,box-shadow,background-color] duration-300 ease-out active:translate-y-0 motion-reduce:transition-none lg:group-hover/create:-translate-y-0.5 lg:group-hover/create:shadow-[0_12px_22px_rgba(31,95,76,0.34)] motion-reduce:lg:group-hover/create:translate-y-0",
    variant === "icon" &&
      "shadow-[0_8px_16px_rgba(31,95,76,0.26)] lg:group-hover/create:shadow-[0_10px_20px_rgba(31,95,76,0.32)]",
    className,
  );
  const createButtonWrapperClassName = cn(
    "group/create pointer-events-auto -m-1 inline-flex",
    variant === "icon" ? "rounded-full" : "rounded-[1.75rem]",
  );

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    showRequiredToast("로그인 후 이용할 수 있어요.");
  };

  if (!isAuthenticated || disabled) {
    return (
      <span className={createButtonWrapperClassName}>
        <CreateButton
          aria-label={ariaLabel}
          className={createButtonClassName}
          disabled={disabled}
          onClick={handleClick}
          variant={variant}
        >
          {children}
        </CreateButton>
      </span>
    );
  }

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
  };

  return (
    <span className={createButtonWrapperClassName}>
      <CreateButton aria-label={ariaLabel} asChild className={createButtonClassName} variant={variant}>
        <Link href={ROUTES.moimCreate} onClick={handleLinkClick}>
          {renderCreateButtonContent(children)}
        </Link>
      </CreateButton>
    </span>
  );
};
