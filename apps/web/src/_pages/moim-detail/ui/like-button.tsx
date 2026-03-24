"use client";

import { UtilityButton } from "@ui/components";

import HeartActiveIcon from "../assets/svg/heart-active.svg";
import HeartDefaultIcon from "../assets/svg/heart-default.svg";

interface LikeButtonProps {
  isLiked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const iconSizeMap = {
  sm: 20,
  md: 24,
  lg: 32,
};

export const LikeButton = ({ isLiked = false, size = "md", className, onClick }: LikeButtonProps) => {
  const iconSize = iconSizeMap[size];
  const Icon = isLiked ? HeartActiveIcon : HeartDefaultIcon;

  return (
    <UtilityButton
      size={size}
      active={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요 추가"}
      className={className}
      onClick={onClick}
      icon={() => (
        <span
          className="inline-flex shrink-0 items-center justify-center leading-none"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        >
          <Icon
            aria-hidden="true"
            className="block shrink-0"
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          />
        </span>
      )}
    />
  );
};
