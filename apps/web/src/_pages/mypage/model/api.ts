import type { FavoriteList, FavoriteWithMeeting, JoinedMeeting, MeetingWithHost } from "@moum-zip/api";

const FAVORITES_PAGE_SIZE = 100;
const MAX_FAVORITES_PAGE_COUNT = 20;

export interface MyMeetingsQuery {
  type: "joined" | "created";
  completed?: "true" | "false";
  reviewed?: "true" | "false";
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
}

export interface MyMeetingsResponse {
  data: Array<JoinedMeeting | MeetingWithHost>;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface MyFavoritesQuery {
  type?: string;
  region?: string;
  date?: string;
  sortBy?: "createdAt" | "dateTime" | "registrationEnd" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
}

const toSearchParams = (query: object) => {
  const searchParams = new URLSearchParams();

  Object.entries(query as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams;
};

export const fetchMyMeetings = async (query: MyMeetingsQuery): Promise<MyMeetingsResponse> => {
  const searchParams = toSearchParams(query);
  const response = await fetch(`/api/mypage/meetings?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("MY_MEETINGS_REQUEST_FAILED");
  }

  // JSON 파싱 에러가 나면 이 함수 컨텍스트에서 바로 확인할 수 있게 await로 처리합니다.
  const data = await response.json();
  return data;
};

export const fetchMyFavorites = async (query: MyFavoritesQuery = {}): Promise<FavoriteList> => {
  const searchParams = toSearchParams(query);
  const response = await fetch(`/api/mypage/favorites?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("MY_FAVORITES_REQUEST_FAILED");
  }

  // JSON 파싱 에러가 나면 이 함수 컨텍스트에서 바로 확인할 수 있게 await로 처리합니다.
  const data = await response.json();
  return data;
};

export const fetchAllMyFavorites = async (
  query: Omit<MyFavoritesQuery, "size" | "cursor"> = {},
): Promise<FavoriteList> => {
  const favorites: FavoriteList["data"] = [];
  let cursor: string | undefined;
  let hasMore = false;
  let pageCount = 0;

  do {
    pageCount += 1;

    // 비정상적인 hasMore/cursor 응답으로 인한 무한 루프를 방지합니다.
    if (pageCount > MAX_FAVORITES_PAGE_COUNT) {
      throw new Error("MY_FAVORITES_PAGINATION_LIMIT_EXCEEDED");
    }

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
};

export const createFavorite = async (meetingId: number): Promise<FavoriteWithMeeting> => {
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

  // JSON 파싱 에러가 나면 이 함수 컨텍스트에서 바로 확인할 수 있게 await로 처리합니다.
  const data = await response.json();
  return data;
};

export const deleteFavorite = async (meetingId: number): Promise<{ ok: true }> => {
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

  // JSON 파싱 에러가 나면 이 함수 컨텍스트에서 바로 확인할 수 있게 await로 처리합니다.
  const data = await response.json();
  return data;
};
