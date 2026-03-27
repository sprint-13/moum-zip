import type { FavoriteList, UserMeetingsResponse } from "@moum-zip/api";

export type MyMeetingsQuery = {
  type: "joined" | "created";
  completed?: "true" | "false";
  reviewed?: "true" | "false";
  sortBy?: "dateTime" | "joinedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
};

export type MyFavoritesQuery = {
  type?: string;
  region?: string;
  date?: string;
  sortBy?: "createdAt" | "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
};

function toSearchParams(query: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams;
}

export async function fetchMyMeetings(query: MyMeetingsQuery): Promise<UserMeetingsResponse> {
  const searchParams = toSearchParams(query);
  const response = await fetch(`/api/mypage/meetings?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("MY_MEETINGS_REQUEST_FAILED");
  }

  return response.json();
}

export async function fetchMyFavorites(query: MyFavoritesQuery = {}): Promise<FavoriteList> {
  const searchParams = toSearchParams(query);
  const response = await fetch(`/api/mypage/favorites?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("MY_FAVORITES_REQUEST_FAILED");
  }

  return response.json();
}
