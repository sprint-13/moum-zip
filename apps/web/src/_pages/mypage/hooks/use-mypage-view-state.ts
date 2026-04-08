"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSpaceSlugAction } from "@/_pages/mypage/actions";
import { useCreatedMeetings } from "@/_pages/mypage/hooks/use-created-meetings";
import type { CreatedFilterKey, MypageMoimCard, MypageTabKey } from "@/_pages/mypage/model";
import { getFavoritesQueryOptions, getJoinedMeetingsQueryOptions } from "@/_pages/mypage/queries";
import {
  applyFavoriteState,
  buildFavoriteMeetingIds,
  buildLikedMeetings,
  useToggleFavorite,
} from "@/_pages/mypage/use-cases";

type MoimTabKey = Exclude<MypageTabKey, "created">;

interface UseMypageViewStateParams {
  initialFavoriteList: FavoriteList;
  moims: Record<MoimTabKey, MypageMoimCard[]>;
  createdMoims: Record<CreatedFilterKey, MypageMoimCard[]>;
  enableRemoteFetch: boolean;
}

const isMypageTabKey = (tab: string): tab is MypageTabKey => {
  return tab === "joined" || tab === "created" || tab === "liked";
};

export const useMypageViewState = ({
  initialFavoriteList,
  moims,
  createdMoims,
  enableRemoteFetch,
}: UseMypageViewStateParams) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<MypageTabKey>("joined");
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterKey>("ongoing");
  const favoriteMutation = useToggleFavorite(enableRemoteFetch);

  const {
    data: joinedMeetingCards = moims.joined,
    isError: isJoinedError,
    refetch: refetchJoinedMeetings,
  } = useQuery({
    ...getJoinedMeetingsQueryOptions(moims.joined),
    enabled: enableRemoteFetch && selectedTab === "joined",
  });

  const {
    data: createdMeetingCards = createdMoims[createdFilter],
    isError: isCreatedError,
    refetch: refetchCreatedMeetings,
  } = useCreatedMeetings(createdFilter, createdMoims[createdFilter], enableRemoteFetch && selectedTab === "created");

  const {
    data: favoriteList,
    isError: isLikedError,
    refetch: refetchLikedMeetings,
  } = useQuery({
    ...getFavoritesQueryOptions(initialFavoriteList),
    enabled: enableRemoteFetch,
  });

  const favoriteMeetingIds = useMemo(
    () => buildFavoriteMeetingIds(enableRemoteFetch ? favoriteList : undefined, moims.liked),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const joinedMeetings = useMemo(
    () => applyFavoriteState(joinedMeetingCards, favoriteMeetingIds),
    [favoriteMeetingIds, joinedMeetingCards],
  );

  const createdMeetings = useMemo(
    () => applyFavoriteState(createdMeetingCards, favoriteMeetingIds),
    [createdMeetingCards, favoriteMeetingIds],
  );

  const likedMeetings = useMemo(
    () => buildLikedMeetings(enableRemoteFetch ? favoriteList : undefined, moims.liked, enableRemoteFetch),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const handleTabChange = (tab: string) => {
    if (!isMypageTabKey(tab)) {
      return;
    }

    setSelectedTab(tab);
  };

  const findMeetingById = (meetingId: string) => {
    return (
      joinedMeetings.find((meeting) => meeting.id === meetingId) ??
      createdMeetings.find((meeting) => meeting.id === meetingId) ??
      likedMeetings.find((meeting) => meeting.id === meetingId)
    );
  };

  const handleToggleLike = (meetingId: string) => {
    if (!enableRemoteFetch) {
      return;
    }

    const meeting = findMeetingById(meetingId);

    if (!meeting) {
      return;
    }

    favoriteMutation.mutate({
      meetingId: Number(meetingId),
      nextLiked: !meeting.liked,
    });
  };

  const handleEnterSpace = async (meetingId: string) => {
    const result = await getSpaceSlugAction(Number(meetingId));

    if (!result.ok) {
      return;
    }

    router.push(`/${result.slug}`);
  };

  return {
    selectedTab,
    createdFilter,
    joinedMeetings,
    createdMeetings,
    likedMeetings,
    isJoinedError,
    isCreatedError,
    isLikedError,
    handleTabChange,
    handleToggleLike,
    handleEnterSpace,
    refetchJoinedMeetings,
    refetchCreatedMeetings,
    refetchLikedMeetings,
    setCreatedFilter,
  };
};
