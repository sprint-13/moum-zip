"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { UtilityButton } from "@ui/components";
import { useEffect, useState, useTransition } from "react";

import { createSearchFavoriteAction, deleteSearchFavoriteAction } from "@/_pages/space-search/actions";
import type { SearchResultsResponse } from "@/entities/gathering";

import HeartIcon from "../assets/heart-default.svg";
import { spaceSearchQueryKeys } from "../model/query-keys";

interface SpaceCardLikeButtonProps {
  isLiked?: boolean;
  meetingId: string;
}

const DefaultHeartIcon = (size: number) => (
  <HeartIcon aria-hidden="true" className="text-border" height={size} width={size} />
);

const ActiveHeartIcon = (size: number) => (
  <HeartIcon aria-hidden="true" fill="url(#icon-gradient)" height={size} width={size} />
);

type SearchResultsInfiniteData = InfiniteData<SearchResultsResponse, string | null>;

const isRedirectError = (error: unknown): error is { digest: string } => {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }

  const { digest } = error as { digest?: unknown };

  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
};

const updateLikedStateInSearchResults = (
  cachedData: SearchResultsInfiniteData | undefined,
  meetingId: string,
  isLiked: boolean,
) => {
  if (!cachedData) {
    return cachedData;
  }

  return {
    ...cachedData,
    pages: cachedData.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => (item.id === meetingId ? { ...item, isLiked } : item)),
    })),
  };
};

export const SpaceCardLikeButton = ({ isLiked = false, meetingId }: SpaceCardLikeButtonProps) => {
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  useEffect(() => {
    setOptimisticIsLiked(isLiked);
  }, [isLiked]);

  const handleClick = () => {
    const parsedMeetingId = Number(meetingId);

    if (!Number.isFinite(parsedMeetingId)) {
      return;
    }

    const previousIsLiked = optimisticIsLiked;
    const nextIsLiked = !previousIsLiked;
    const rollbackLikedState = () => {
      setOptimisticIsLiked(previousIsLiked);
      queryClient.setQueriesData<SearchResultsInfiniteData>(
        {
          predicate: (query) => query.queryKey[0] === spaceSearchQueryKeys.all[0],
        },
        (cachedData) => updateLikedStateInSearchResults(cachedData, meetingId, previousIsLiked),
      );
    };

    setOptimisticIsLiked(nextIsLiked);
    queryClient.setQueriesData<SearchResultsInfiniteData>(
      {
        predicate: (query) => query.queryKey[0] === spaceSearchQueryKeys.all[0],
      },
      (cachedData) => updateLikedStateInSearchResults(cachedData, meetingId, nextIsLiked),
    );

    startTransition(async () => {
      try {
        if (nextIsLiked) {
          await createSearchFavoriteAction(parsedMeetingId);
        } else {
          await deleteSearchFavoriteAction(parsedMeetingId);
        }
      } catch (error) {
        if (isRedirectError(error)) {
          rollbackLikedState();

          throw error;
        }

        rollbackLikedState();
      }
    });
  };

  return (
    <UtilityButton
      active={optimisticIsLiked}
      aria-label={optimisticIsLiked ? "좋아요 취소" : "좋아요 추가"}
      className="shrink-0"
      disabled={isPending}
      icon={optimisticIsLiked ? ActiveHeartIcon : DefaultHeartIcon}
      onClick={handleClick}
    />
  );
};
