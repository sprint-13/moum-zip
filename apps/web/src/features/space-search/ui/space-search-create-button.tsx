"use client";

import { CreateButton } from "@ui/components";
import type { ComponentProps } from "react";
import { useTransition } from "react";

import { redirectToMoimCreateAction } from "@/_pages/space-search/actions";

type SpaceSearchCreateButtonProps = ComponentProps<typeof CreateButton>;

export const SpaceSearchCreateButton = ({ disabled, onClick, ...props }: SpaceSearchCreateButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick: SpaceSearchCreateButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startTransition(async () => {
      await redirectToMoimCreateAction();
    });
  };

  return <CreateButton {...props} disabled={disabled || isPending} onClick={handleClick} />;
};
