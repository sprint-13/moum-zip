import type { FavoriteList } from "@moum-zip/api";
import { mapFavoriteMeeting } from "../model/mappers";
import type { MypageMoimCard } from "../model/types";

export const buildFavoriteMeetingIds = (favoriteList: FavoriteList | undefined, fallbackMoims: MypageMoimCard[]) => {
  return new Set(
    favoriteList?.data.map((favorite) => String(favorite.meetingId)) ?? fallbackMoims.map((moim) => moim.id),
  );
};

export const applyFavoriteState = (moims: MypageMoimCard[], favoriteMeetingIds: Set<string>) => {
  return moims.map((moim) => ({
    ...moim,
    liked: favoriteMeetingIds.has(moim.id),
  }));
};

export const buildLikedMeetings = (
  favoriteList: FavoriteList | undefined,
  fallbackMoims: MypageMoimCard[],
  enableRemoteFetch: boolean,
  currentUserId: number,
) => {
  if (!enableRemoteFetch) {
    return fallbackMoims;
  }

  if (!favoriteList) {
    return fallbackMoims;
  }

  return favoriteList.data.map((favorite, index) => mapFavoriteMeeting(favorite, index, currentUserId));
};

export const mergeEnterableLikedMeetings = (
  likedMeetings: MypageMoimCard[],
  enterableMeetings: MypageMoimCard[],
): MypageMoimCard[] => {
  const enterableMeetingMap = new Map(enterableMeetings.map((meeting) => [meeting.id, meeting]));

  return likedMeetings.map((meeting) => {
    const enterableMeeting = enterableMeetingMap.get(meeting.id);

    if (!enterableMeeting) {
      return meeting;
    }

    return {
      ...enterableMeeting,
      liked: true,
    };
  });
};

export const updateLikedState = (moims: MypageMoimCard[] | undefined, meetingId: string, nextLiked: boolean) => {
  if (!moims) {
    return moims;
  }

  return moims.map((moim) => (moim.id === meetingId ? { ...moim, liked: nextLiked } : moim));
};
