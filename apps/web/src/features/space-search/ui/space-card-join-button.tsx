"use client";

import { Button } from "@ui/components";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { ROUTES } from "@/shared/config/routes";
import { showRequiredToast } from "@/shared/lib/toast-utils";

interface SpaceCardJoinButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  isAuthenticated: boolean;
  meetingId: string;
}

export const SpaceCardJoinButton = ({ isAuthenticated, meetingId, ...props }: SpaceCardJoinButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      showRequiredToast("로그인 후 이용할 수 있어요.");
      return;
    }

    router.push(`${ROUTES.moimDetail}/${meetingId}`);
  };

  return <Button {...props} onClick={handleClick} />;
};
