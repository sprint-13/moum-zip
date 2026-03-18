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
      aria-label={isLiked ? "Remove favorite" : "Add favorite"}
      className="shrink-0"
      icon={isLiked ? ActiveHeartIcon : DefaultHeartIcon}
    />
  );
};
