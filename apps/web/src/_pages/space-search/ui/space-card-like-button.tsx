"use client";

import { UtilityButton } from "@ui/components";

import HeartActiveIcon from "../assets/heart-active.svg";
import HeartDefaultIcon from "../assets/heart-default.svg";

interface SpaceCardLikeButtonProps {
  isLiked?: boolean;
}

const DefaultHeartIcon = (size: number) => <HeartDefaultIcon aria-hidden="true" height={size} width={size} />;

const ActiveHeartIcon = (size: number) => <HeartActiveIcon aria-hidden="true" height={size} width={size} />;

export const SpaceCardLikeButton = ({ isLiked = false }: SpaceCardLikeButtonProps) => {
  return (
    <UtilityButton
      active={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요 추가"}
      className="shrink-0"
      icon={isLiked ? ActiveHeartIcon : DefaultHeartIcon}
    />
  );
};
