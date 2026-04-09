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
  const shouldFetchCreatedMeetings = enableRemoteFetch && (selectedTab === "created" || selectedTab === "liked");

  const {
    data: joinedMeetingCards = moims.joined,
    isError: isJoinedError,
    refetch: refetchJoinedMeetings,
  } = useQuery({
    ...getJoinedMeetingsQueryOptions(moims.joined),
    enabled: enableRemoteFetch && selectedTab === "joined",
  });

  const {
    data: ongoingCreatedMeetingCards = createdMoims.ongoing,
    isError: isOngoingCreatedError,
    refetch: refetchOngoingCreatedMeetings,
  } = useCreatedMeetings("ongoing", createdMoims.ongoing, shouldFetchCreatedMeetings);

  const {
    data: endedCreatedMeetingCards = createdMoims.ended,
    isError: isEndedCreatedError,
    refetch: refetchEndedCreatedMeetings,
  } = useCreatedMeetings("ended", createdMoims.ended, shouldFetchCreatedMeetings);

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

  const ongoingCreatedMeetings = useMemo(
    () => applyFavoriteState(ongoingCreatedMeetingCards, favoriteMeetingIds),
    [favoriteMeetingIds, ongoingCreatedMeetingCards],
  );

  const endedCreatedMeetings = useMemo(
    () => applyFavoriteState(endedCreatedMeetingCards, favoriteMeetingIds),
    [endedCreatedMeetingCards, favoriteMeetingIds],
  );

  const createdMeetings = createdFilter === "ongoing" ? ongoingCreatedMeetings : endedCreatedMeetings;

  const likedMeetings = useMemo(
    () => buildLikedMeetings(enableRemoteFetch ? favoriteList : undefined, moims.liked, enableRemoteFetch),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const enterableMeetingIds = useMemo(() => {
    return new Set(
      [...joinedMeetings, ...ongoingCreatedMeetings, ...endedCreatedMeetings].map((meeting) => meeting.id),
    );
  }, [endedCreatedMeetings, joinedMeetings, ongoingCreatedMeetings]);

  const meetingMap = useMemo(() => {
    return [...joinedMeetings, ...ongoingCreatedMeetings, ...endedCreatedMeetings, ...likedMeetings].reduce(
      (map, meeting) => {
        if (!map.has(meeting.id)) {
          map.set(meeting.id, meeting);
        }

        return map;
      },
      new Map<string, MypageMoimCard>(),
    );
  }, [endedCreatedMeetings, joinedMeetings, likedMeetings, ongoingCreatedMeetings]);

  const handleTabChange = (tab: string) => {
    if (!isMypageTabKey(tab)) {
      return;
    }

    setSelectedTab(tab);
  };

  const findMeetingById = (meetingId: string) => {
    return meetingMap.get(meetingId);
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
    enterableMeetingIds,
    isJoinedError,
    isCreatedError: createdFilter === "ongoing" ? isOngoingCreatedError : isEndedCreatedError,
    isLikedError,
    handleTabChange,
    handleToggleLike,
    handleEnterSpace,
    refetchJoinedMeetings,
    refetchCreatedMeetings: createdFilter === "ongoing" ? refetchOngoingCreatedMeetings : refetchEndedCreatedMeetings,
    refetchLikedMeetings,
    setCreatedFilter,
  };
};
