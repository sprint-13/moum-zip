import type { FavoriteList } from "@moum-zip/api";
import { mapFavoriteMeeting } from "../model/mappers";
import type { MypageMoimCard } from "../model/types";

export function buildFavoriteMeetingIds(favoriteList: FavoriteList | undefined, fallbackMoims: MypageMoimCard[]) {
  return new Set(
    favoriteList?.data.map((favorite) => String(favorite.meetingId)) ?? fallbackMoims.map((moim) => moim.id),
  );
}

export function applyFavoriteState(moims: MypageMoimCard[], favoriteMeetingIds: Set<string>) {
  return moims.map((moim) => ({
    ...moim,
    liked: favoriteMeetingIds.has(moim.id),
  }));
}

export function buildLikedMeetings(
  favoriteList: FavoriteList | undefined,
  fallbackMoims: MypageMoimCard[],
  enableRemoteFetch: boolean,
) {
  return enableRemoteFetch ? (favoriteList?.data ?? []).map(mapFavoriteMeeting) : fallbackMoims;
}

export function updateLikedState(moims: MypageMoimCard[] | undefined, meetingId: string, nextLiked: boolean) {
  if (!moims) {
    return moims;
  }

  return moims.map((moim) => (moim.id === meetingId ? { ...moim, liked: nextLiked } : moim));
}
