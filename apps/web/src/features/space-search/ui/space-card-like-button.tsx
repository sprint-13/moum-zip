"use client";

import { UtilityButton } from "@ui/components";

import HeartIcon from "../assets/heart-default.svg";

interface SpaceCardLikeButtonProps {
  isLiked?: boolean;
}

const DefaultHeartIcon = (size: number) => (
  <HeartIcon aria-hidden="true" className="text-border" height={size} width={size} />
);

const ActiveHeartIcon = (size: number) => (
  <HeartIcon aria-hidden="true" fill="url(#icon-gradient)" height={size} width={size} />
);

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
