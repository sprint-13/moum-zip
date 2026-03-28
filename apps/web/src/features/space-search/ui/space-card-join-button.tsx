"use client";

import { Button } from "@ui/components";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { ROUTES } from "@/shared/config/routes";

type SpaceCardJoinButtonProps = ComponentProps<typeof Button> & { meetingId: string };

export const SpaceCardJoinButton = ({ onClick, meetingId, ...props }: SpaceCardJoinButtonProps) => {
  const router = useRouter();

  // TODO: 라우팅 용 버튼인데 onClick compose할 필요 없어 보임
  const handleClick: SpaceCardJoinButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    router.push(`${ROUTES.moimDetail}/${meetingId}`);
  };

  return <Button {...props} onClick={handleClick} />;
};
