"use client";

import { CreateButton } from "@ui/components";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { ROUTES } from "@/shared/config/routes";
import { showRequiredToast } from "@/shared/lib/toast-utils";

interface SpaceSearchCreateButtonProps extends ComponentProps<typeof CreateButton> {
  isAuthenticated: boolean;
}

export const SpaceSearchCreateButton = ({
  disabled,
  isAuthenticated,
  onClick,
  ...props
}: SpaceSearchCreateButtonProps) => {
  const router = useRouter();

  const handleClick: SpaceSearchCreateButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!isAuthenticated) {
      showRequiredToast("로그인 후 이용할 수 있어요.");
      return;
    }

    router.push(ROUTES.moimCreate);
  };

  return <CreateButton {...props} disabled={disabled} onClick={handleClick} />;
};
