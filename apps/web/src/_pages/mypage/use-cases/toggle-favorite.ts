"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { createFavorite, deleteFavorite } from "../model";
import type { MypageMoimCard } from "../model/types";
import { updateLikedState } from "./favorite-state";

export function useToggleFavorite(enableRemoteFetch: boolean) {
  const queryClient = useQueryClient();
  const requestVersionRef = useRef(new Map<number, number>());

  return useMutation({
    mutationFn: async ({ meetingId, nextLiked }: { meetingId: number; nextLiked: boolean }) => {
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
        previousJoined,
        previousCreatedOngoing,
        previousCreatedEnded,
        previousFavorites,
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

      queryClient.setQueryData(["mypage", "meetings", "joined"], context.previousJoined);
      queryClient.setQueryData(["mypage", "meetings", "created", "ongoing"], context.previousCreatedOngoing);
      queryClient.setQueryData(["mypage", "meetings", "created", "ended"], context.previousCreatedEnded);
      queryClient.setQueryData(["mypage", "favorites"], context.previousFavorites);
    },
    meta: { enableRemoteFetch },
  });
}
