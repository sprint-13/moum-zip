"use client";

import { UtilityButton } from "@ui/components";
import { cn } from "@ui/lib/utils";

import HeartActiveIcon from "../assets/svg/heart-active.svg";
import HeartDefaultIcon from "../assets/svg/heart-default.svg";

interface LikeButtonProps {
  isLiked?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LikeButton = ({ isLiked = false, className, onClick }: LikeButtonProps) => {
  const Icon = isLiked ? HeartActiveIcon : HeartDefaultIcon;

  return (
    <UtilityButton
      active={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요 추가"}
      onClick={onClick}
      className={cn("h-10 w-10 sm:h-[60px] sm:w-[60px]", className)}
      icon={() => (
        <span className="inline-flex items-center justify-center">
          <Icon aria-hidden="true" className="block h-5 w-5 sm:h-8 sm:w-8" />
        </span>
      )}
    />
  );
};
