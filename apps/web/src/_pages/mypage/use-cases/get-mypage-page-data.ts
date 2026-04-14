import type { FavoriteList, JoinedMeetingList, User } from "@moum-zip/api";
import { type MypageMoimCard, type MypageProfile, mapFavoriteMeeting, mapJoinedMeeting, mapProfile } from "../model";

interface Deps {
  getUser: () => Promise<{ data: User }>;
  getJoinedMeetings: () => Promise<{ data: JoinedMeetingList }>;
  getFavoritesPage: (cursor?: string) => Promise<{ data: FavoriteList }>;
}

interface MypagePageData {
  initialFavoriteList: FavoriteList;
  profile: MypageProfile;
  moims: Record<"joined" | "liked", MypageMoimCard[]>;
  createdMoims: Record<"ongoing" | "ended", MypageMoimCard[]>;
}

const getAllFavorites = async (getFavoritesPage: Deps["getFavoritesPage"]): Promise<FavoriteList> => {
  const favorites: FavoriteList["data"] = [];
  let cursor: string | undefined;
  let hasMore = false;

  do {
    const { data } = await getFavoritesPage(cursor);
    favorites.push(...data.data);
    cursor = data.nextCursor ?? undefined;
    hasMore = data.hasMore;
  } while (hasMore && cursor);

  return {
    data: favorites,
    nextCursor: cursor ?? null,
    hasMore,
  };
};

export const getMypagePageData = async ({
  getUser,
  getJoinedMeetings,
  getFavoritesPage,
}: Deps): Promise<MypagePageData> => {
  const [{ data: user }, { data: joinedMeetings }, favoritesList] = await Promise.all([
    getUser(),
    getJoinedMeetings(),
    getAllFavorites(getFavoritesPage),
  ]);

  const profile = mapProfile(user);
  const favoriteMeetingIds = new Set(favoritesList.data.map((favorite) => favorite.meetingId));

  return {
    initialFavoriteList: favoritesList,
    profile,
    moims: {
      joined: joinedMeetings.data.map((meeting, index) =>
        mapJoinedMeeting(meeting, index, user.id, favoriteMeetingIds.has(meeting.id)),
      ),
      liked: favoritesList.data.map((favorite, index) => mapFavoriteMeeting(favorite, index, user.id)),
    },
    createdMoims: {
      ongoing: [],
      ended: [],
    },
  };
};
