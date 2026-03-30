import type { FavoriteList, FavoriteWithMeeting, UserMeetingsResponse } from "@moum-zip/api";

const FAVORITES_PAGE_SIZE = 100;

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

export async function fetchAllMyFavorites(
  query: Omit<MyFavoritesQuery, "size" | "cursor"> = {},
): Promise<FavoriteList> {
  const favorites: FavoriteList["data"] = [];
  let cursor: string | undefined;
  let hasMore = false;

  do {
    const response = await fetchMyFavorites({
      ...query,
      size: FAVORITES_PAGE_SIZE,
      cursor,
    });

    favorites.push(...response.data);
    cursor = response.nextCursor ?? undefined;
    hasMore = response.hasMore;
  } while (hasMore && cursor);

  return {
    data: favorites,
    nextCursor: cursor ?? null,
    hasMore,
  };
}

export async function createFavorite(meetingId: number): Promise<FavoriteWithMeeting> {
  const response = await fetch("/api/mypage/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  });

  if (!response.ok) {
    throw new Error("CREATE_FAVORITE_REQUEST_FAILED");
  }

  return response.json();
}

export async function deleteFavorite(meetingId: number): Promise<{ ok: true }> {
  const response = await fetch("/api/mypage/favorites", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  });

  if (!response.ok) {
    throw new Error("DELETE_FAVORITE_REQUEST_FAILED");
  }

  return response.json();
}
