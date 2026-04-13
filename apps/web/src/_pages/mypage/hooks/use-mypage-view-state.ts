"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSpaceSlugAction } from "@/_pages/mypage/actions";
import { useCreatedMeetings } from "@/_pages/mypage/hooks/use-created-meetings";
import type { CreatedFilterKey, MypageMoimCard, MypageProfile, MypageTabKey } from "@/_pages/mypage/model";
import { getFavoritesQueryOptions, getJoinedMeetingsQueryOptions } from "@/_pages/mypage/queries";
import {
  applyFavoriteState,
  buildFavoriteMeetingIds,
  buildLikedMeetings,
  mergeEnterableLikedMeetings,
  useToggleFavorite,
} from "@/_pages/mypage/use-cases";

type MoimTabKey = Exclude<MypageTabKey, "created">;

interface UseMypageViewStateParams {
  initialFavoriteList: FavoriteList;
  moims: Record<MoimTabKey, MypageMoimCard[]>;
  createdMoims: Record<CreatedFilterKey, MypageMoimCard[]>;
  enableRemoteFetch: boolean;
  profile: MypageProfile;
}

const isMypageTabKey = (tab: string): tab is MypageTabKey => {
  return tab === "joined" || tab === "created" || tab === "liked";
};

export const useMypageViewState = ({
  initialFavoriteList,
  moims,
  createdMoims,
  enableRemoteFetch,
  profile,
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
    ...getJoinedMeetingsQueryOptions(moims.joined, profile.userId),
    enabled: enableRemoteFetch && selectedTab === "joined",
  });

  const {
    data: createdMeetingCards = createdMoims,
    isError: isCreatedError,
    refetch: refetchCreatedMeetings,
  } = useCreatedMeetings(createdMoims, shouldFetchCreatedMeetings);

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
    () => applyFavoriteState(createdMeetingCards.ongoing, favoriteMeetingIds),
    [createdMeetingCards.ongoing, favoriteMeetingIds],
  );

  const endedCreatedMeetings = useMemo(
    () => applyFavoriteState(createdMeetingCards.ended, favoriteMeetingIds),
    [createdMeetingCards.ended, favoriteMeetingIds],
  );

  const createdMeetings = createdFilter === "ongoing" ? ongoingCreatedMeetings : endedCreatedMeetings;

  const likedMeetings = useMemo(
    () =>
      mergeEnterableLikedMeetings(
        buildLikedMeetings(
          enableRemoteFetch ? favoriteList : undefined,
          moims.liked,
          enableRemoteFetch,
          profile.userId,
        ),
        [...joinedMeetings, ...ongoingCreatedMeetings, ...endedCreatedMeetings],
      ),
    [
      enableRemoteFetch,
      endedCreatedMeetings,
      favoriteList,
      joinedMeetings,
      moims.liked,
      ongoingCreatedMeetings,
      profile.userId,
    ],
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
      currentUserId: profile.userId,
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
