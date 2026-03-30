import type { FavoriteList, User, UserMeetingsResponse } from "@moum-zip/api";
import { type MypageMoimCard, type MypageProfile, mapFavoriteMeeting, mapJoinedMeeting, mapProfile } from "../model";

type Deps = {
  getUser: () => Promise<{ data: User }>;
  getJoinedMeetings: () => Promise<{ data: UserMeetingsResponse }>;
  getFavoritesPage: (cursor?: string) => Promise<{ data: FavoriteList }>;
};

type MypagePageData = {
  initialFavoriteList: FavoriteList;
  profile: MypageProfile;
  moims: Record<"joined" | "liked", MypageMoimCard[]>;
  createdMoims: Record<"ongoing" | "ended", MypageMoimCard[]>;
};

async function getAllFavorites(getFavoritesPage: Deps["getFavoritesPage"]): Promise<FavoriteList> {
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
}

export async function getMypagePageData({
  getUser,
  getJoinedMeetings,
  getFavoritesPage,
}: Deps): Promise<MypagePageData> {
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
        mapJoinedMeeting(meeting, index, favoriteMeetingIds.has(meeting.id)),
      ),
      liked: favoritesList.data.map(mapFavoriteMeeting),
    },
    createdMoims: {
      ongoing: [],
      ended: [],
    },
  };
}
