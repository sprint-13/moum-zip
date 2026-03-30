"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast, UtilityButton } from "@ui/components";
import { useEffect, useState, useTransition } from "react";

import { createSearchFavoriteAction, deleteSearchFavoriteAction } from "@/_pages/space-search/actions";
import type { SearchResultsResponse } from "@/entities/gathering";

import HeartIcon from "../assets/heart-default.svg";
import { spaceSearchQueryKeys } from "../model/query-keys";

interface SpaceCardLikeButtonProps {
  isAuthenticated: boolean;
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

  let hasChanged = false;

  const pages = cachedData.pages.map((page) => {
    let hasChangedInPage = false;

    const items = page.items.map((item) => {
      if (item.id !== meetingId || item.isLiked === isLiked) {
        return item;
      }

      hasChanged = true;
      hasChangedInPage = true;

      return { ...item, isLiked };
    });

    if (!hasChangedInPage) {
      return page;
    }

    return {
      ...page,
      items,
    };
  });

  if (!hasChanged) {
    return cachedData;
  }

  return {
    ...cachedData,
    pages,
  };
};

export const SpaceCardLikeButton = ({ isAuthenticated, isLiked = false, meetingId }: SpaceCardLikeButtonProps) => {
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const matchesSearchResultsQuery = (queryKey: readonly unknown[]) =>
    queryKey[0] === spaceSearchQueryKeys.all[0] &&
    typeof queryKey[2] === "object" &&
    queryKey[2] !== null &&
    "isAuthenticated" in queryKey[2] &&
    queryKey[2].isAuthenticated === isAuthenticated;

  useEffect(() => {
    setOptimisticIsLiked(isLiked);
  }, [isLiked]);

  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        message: "로그인 후 이용할 수 있어요.",
        size: "small",
      });
      return;
    }

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
          predicate: (query) => matchesSearchResultsQuery(query.queryKey),
        },
        (cachedData) => updateLikedStateInSearchResults(cachedData, meetingId, previousIsLiked),
      );
    };

    setOptimisticIsLiked(nextIsLiked);
    queryClient.setQueriesData<SearchResultsInfiniteData>(
      {
        predicate: (query) => matchesSearchResultsQuery(query.queryKey),
      },
      (cachedData) => updateLikedStateInSearchResults(cachedData, meetingId, nextIsLiked),
    );

    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const timerLabel = nextIsLiked
      ? `[search] client like action meetingId=${meetingId} requestId=${requestId}`
      : `[search] client unlike action meetingId=${meetingId} requestId=${requestId}`;
    console.time(timerLabel);

    startTransition(async () => {
      try {
        const result = nextIsLiked
          ? await createSearchFavoriteAction(parsedMeetingId)
          : await deleteSearchFavoriteAction(parsedMeetingId);

        if (!result.ok) {
          rollbackLikedState();

          if (result.error === "UNAUTHORIZED") {
            toast({
              message: "로그인 후 이용할 수 있어요.",
              size: "small",
            });
            return;
          }

          toast({
            message: "요청에 실패했어요. 다시 시도해 주세요.",
            size: "small",
          });
        }
      } catch (error) {
        rollbackLikedState();

        if (isRedirectError(error)) {
          throw error;
        }

        toast({
          message: "요청에 실패했어요. 다시 시도해 주세요.",
          size: "small",
        });
      } finally {
        console.timeEnd(timerLabel);
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
