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
  return (
    <UtilityButton
      type="button"
      size={size}
      active={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요 추가"}
      className={className}
      onClick={onClick}
      icon={() => {
        const iconSize = iconSizeMap[size];

        return (
          <span className="inline-flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
            {isLiked ? (
              <HeartActiveIcon aria-hidden="true" className="size-full" />
            ) : (
              <HeartDefaultIcon aria-hidden="true" className="size-full" />
            )}
          </span>
        );
      }}
    />
  );
};
