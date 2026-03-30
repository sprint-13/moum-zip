import type { FavoriteList, User, UserMeetingsResponse } from "@moum-zip/api";
import { type MypageMoimCard, type MypageProfile, mapJoinedMeeting, mapProfile } from "../model";

type Deps = {
  getUser: () => Promise<{ data: User }>;
  getJoinedMeetings: () => Promise<{ data: UserMeetingsResponse }>;
  getFavorites: () => Promise<{ data: FavoriteList }>;
};

type MypagePageData = {
  profile: MypageProfile;
  moims: Record<"joined" | "liked", MypageMoimCard[]>;
  createdMoims: Record<"ongoing" | "ended", MypageMoimCard[]>;
};

export async function getMypagePageData({ getUser, getJoinedMeetings, getFavorites }: Deps): Promise<MypagePageData> {
  const [{ data: user }, { data: joinedMeetings }, { data: favoritesList }] = await Promise.all([
    getUser(),
    getJoinedMeetings(),
    getFavorites(),
  ]);

  const profile = mapProfile(user);
  const favoriteMeetingIds = new Set(favoritesList.data.map((favorite) => favorite.meetingId));

  return {
    profile,
    moims: {
      joined: joinedMeetings.data.map((meeting, index) =>
        mapJoinedMeeting(meeting, index, favoriteMeetingIds.has(meeting.id)),
      ),
      liked: [],
    },
    createdMoims: {
      ongoing: [],
      ended: [],
    },
  };
}
