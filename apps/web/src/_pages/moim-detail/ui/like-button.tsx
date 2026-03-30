"use client";

import { UtilityButton } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useEffect, useState, useTransition } from "react";

import HeartActiveIcon from "../assets/svg/heart-active.svg";
import HeartDefaultIcon from "../assets/svg/heart-default.svg";

interface LikeButtonProps {
  isLiked?: boolean;
  className?: string;
  onClick?: () => void | Promise<void>;
}

export const LikeButton = ({ isLiked = false, className, onClick }: LikeButtonProps) => {
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOptimisticIsLiked(isLiked);
  }, [isLiked]);

  const handleClick = () => {
    const previousIsLiked = optimisticIsLiked;
    const nextIsLiked = !previousIsLiked;

    setOptimisticIsLiked(nextIsLiked);

    startTransition(async () => {
      try {
        await onClick?.();
      } catch {
        setOptimisticIsLiked(previousIsLiked);
      }
    });
  };

  const Icon = optimisticIsLiked ? HeartActiveIcon : HeartDefaultIcon;

  return (
    <UtilityButton
      active={optimisticIsLiked}
      aria-label={optimisticIsLiked ? "좋아요 취소" : "좋아요 추가"}
      onClick={handleClick}
      disabled={isPending}
      className={cn("h-10 w-10 shrink-0 sm:h-[60px] sm:w-[60px]", className)}
      icon={() => (
        <span className="inline-flex items-center justify-center">
          <Icon aria-hidden="true" className="block h-5 w-5 sm:h-8 sm:w-8" />
        </span>
      )}
    />
  );
};
