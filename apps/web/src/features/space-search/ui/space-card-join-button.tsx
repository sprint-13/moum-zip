"use client";

import { Button } from "@ui/components";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { ROUTES } from "@/shared/config/routes";

type SpaceCardJoinButtonProps = ComponentProps<typeof Button>;

export const SpaceCardJoinButton = ({ onClick, ...props }: SpaceCardJoinButtonProps) => {
  const router = useRouter();

  const handleClick: SpaceCardJoinButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    router.push(ROUTES.moimDetail);
  };

  return <Button {...props} onClick={handleClick} />;
};
