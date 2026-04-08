"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { createFavorite, deleteFavorite } from "../model";
import type { MypageMoimCard } from "../model/types";
import { updateLikedState } from "./favorite-state";

interface ToggleFavoriteMutationParams {
  meetingId: number;
  nextLiked: boolean;
}

const findMeetingLiked = (meetings: MypageMoimCard[] | undefined, meetingId: string) => {
  return meetings?.find((meeting) => meeting.id === meetingId)?.liked;
};

const restoreLikedState = (
  meetings: MypageMoimCard[] | undefined,
  meetingId: string,
  previousLiked: boolean | undefined,
) => {
  if (previousLiked === undefined) {
    return meetings;
  }

  return meetings?.map((meeting) => (meeting.id === meetingId ? { ...meeting, liked: previousLiked } : meeting));
};

const restoreFavoriteItem = (
  current: FavoriteList | undefined,
  previousFavorite: FavoriteList["data"][number] | undefined,
  previousFavoriteIndex: number,
  meetingId: number,
) => {
  if (!current) {
    if (!previousFavorite) {
      return current;
    }

    return {
      data: [previousFavorite],
      nextCursor: null,
      hasMore: false,
    };
  }

  const filtered = current.data.filter((favorite) => favorite.meetingId !== meetingId);

  if (!previousFavorite) {
    return {
      ...current,
      data: filtered,
    };
  }

  const nextData = [...filtered];
  nextData.splice(Math.min(previousFavoriteIndex, nextData.length), 0, previousFavorite);

  return {
    ...current,
    data: nextData,
  };
};

export const useToggleFavorite = (enableRemoteFetch: boolean) => {
  const queryClient = useQueryClient();
  const requestVersionRef = useRef(new Map<number, number>());

  return useMutation({
    mutationFn: async ({ meetingId, nextLiked }: ToggleFavoriteMutationParams) => {
      if (nextLiked) {
        return createFavorite(meetingId);
      }

      await deleteFavorite(meetingId);
      return null;
    },
    onMutate: async ({ meetingId, nextLiked }) => {
      // meetingId별 최신 요청 버전을 기록해 늦게 도착한 이전 응답을 무시합니다.
      const requestVersion = (requestVersionRef.current.get(meetingId) ?? 0) + 1;
      requestVersionRef.current.set(meetingId, requestVersion);
      const meetingIdString = String(meetingId);

      // 진행 중인 refetch 응답이 optimistic state를 덮어쓰지 않도록 먼저 취소합니다.
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["mypage", "meetings", "joined"] }),
        queryClient.cancelQueries({ queryKey: ["mypage", "meetings", "created", "ongoing"] }),
        queryClient.cancelQueries({ queryKey: ["mypage", "meetings", "created", "ended"] }),
        queryClient.cancelQueries({ queryKey: ["mypage", "favorites"] }),
      ]);

      const previousJoined = queryClient.getQueryData<MypageMoimCard[]>(["mypage", "meetings", "joined"]);
      const previousCreatedOngoing = queryClient.getQueryData<MypageMoimCard[]>([
        "mypage",
        "meetings",
        "created",
        "ongoing",
      ]);
      const previousCreatedEnded = queryClient.getQueryData<MypageMoimCard[]>([
        "mypage",
        "meetings",
        "created",
        "ended",
      ]);
      const previousFavorites = queryClient.getQueryData<FavoriteList>(["mypage", "favorites"]);
      const previousFavoriteIndex =
        previousFavorites?.data.findIndex((favorite) => favorite.meetingId === meetingId) ?? -1;
      const previousFavorite = previousFavoriteIndex >= 0 ? previousFavorites?.data[previousFavoriteIndex] : undefined;

      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "joined"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ongoing"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ended"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );

      if (!nextLiked) {
        queryClient.setQueryData<FavoriteList>(["mypage", "favorites"], (current) =>
          current
            ? {
                ...current,
                data: current.data.filter((favorite) => favorite.meetingId !== meetingId),
              }
            : current,
        );
      }

      return {
        requestVersion,
        previousJoinedLiked: findMeetingLiked(previousJoined, meetingIdString),
        previousCreatedOngoingLiked: findMeetingLiked(previousCreatedOngoing, meetingIdString),
        previousCreatedEndedLiked: findMeetingLiked(previousCreatedEnded, meetingIdString),
        previousFavorite,
        previousFavoriteIndex,
      };
    },
    onSuccess: (data, { meetingId, nextLiked }, context) => {
      if (!context || requestVersionRef.current.get(meetingId) !== context.requestVersion) {
        return;
      }

      if (nextLiked && data) {
        queryClient.setQueryData<FavoriteList>(["mypage", "favorites"], (current) => {
          if (!current) {
            return {
              data: [data],
              nextCursor: null,
              hasMore: false,
            };
          }

          if (current.data.some((favorite) => favorite.meetingId === data.meetingId)) {
            return current;
          }

          return {
            ...current,
            data: [data, ...current.data],
          };
        });
      }
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      if (requestVersionRef.current.get(variables.meetingId) !== context.requestVersion) {
        return;
      }

      const meetingIdString = String(variables.meetingId);

      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "joined"], (current) =>
        restoreLikedState(current, meetingIdString, context.previousJoinedLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ongoing"], (current) =>
        restoreLikedState(current, meetingIdString, context.previousCreatedOngoingLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ended"], (current) =>
        restoreLikedState(current, meetingIdString, context.previousCreatedEndedLiked),
      );
      queryClient.setQueryData<FavoriteList>(["mypage", "favorites"], (current) =>
        restoreFavoriteItem(current, context.previousFavorite, context.previousFavoriteIndex, variables.meetingId),
      );
    },
    meta: { enableRemoteFetch },
  });
};
