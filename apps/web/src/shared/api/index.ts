/**
 * @file shared/api/index.ts
 *
 * 레이어 구조
 * ┌─────────────────────────────────────────────────────┐
 * │  index.ts  (이 파일)                                 │
 * │  - 순수 TS, Next.js 의존성 없음                       │
 * │  - 클라이언트/서버 공용으로 import 가능               │
 * │  - publicCore 싱글턴 → api 객체 (인증 불필요)         │
 * │  - createApiClient() → 요청마다 customFetch 주입      │
 * ├─────────────────────────────────────────────────────┤
 * │  server.ts                                          │
 * │  - Next.js 전용 (next/headers, next/navigation)     │
 * │  - getApiClient() : cookies()로 콜백 조립            │
 * │  - isAuth()       : 토큰 유효성 검증                  │
 * └─────────────────────────────────────────────────────┘
 */

import {
  Auth,
  Favorites,
  Images,
  Meetings,
  MeetingTypes,
  Notifications,
  Posts,
  Reviews,
  Users,
} from "@moum-zip/api/index";
import { API_BASE_URL as baseUrl, TEAM_ID as teamId } from "@/shared/config/env";

// ─────────────────────────────────────────────────────────────
// createAuthFetch
//
// axios response interceptor와 동일한 역할을 하는 fetch 래퍼
// HttpClient의 customFetch 슬롯에 주입되어 모든 요청을 가로챔
//
// 처리 흐름:
//   1. 요청 전  : getAccessToken()으로 Authorization 헤더 주입
//   2. 응답 후  : 401이 아니면 그대로 반환
//   3. 401 감지 : getRefreshToken()으로 토큰 갱신 시도
//   4. 갱신 성공: onTokenRefreshed() 콜백으로 새 토큰 저장 위임 후 원래 요청 재시도
//   5. 갱신 실패: onAuthFailed() 콜백 호출 후 401 Response 반환
//               redirect 등 환경 종속 처리는 호출부에서 콜백으로 주입
//
//    refresh 엔드포인트는 반드시 raw fetch로 직접 호출해야 함
//    customFetch로 호출하면 401 → refresh → 401 → refresh ... 무한루프 발생
// ─────────────────────────────────────────────────────────────

function createAuthFetch(
  getAccessToken: () => string | undefined,
  getRefreshToken: () => string | undefined,
  onTokenRefreshed: (tokens: { accessToken: string; refreshToken: string }) => Promise<void> | void,
  onAuthFailed: () => Promise<void> | void,
): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    const accessToken = getAccessToken();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(input, { ...init, headers });

    if (response.status !== 401) return response;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      await onAuthFailed();
      return new Response(null, { status: 401 });
    }

    const refreshResponse = await fetch(`${baseUrl}/${teamId}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      await onAuthFailed();
      return new Response(null, { status: 401 });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

    await onTokenRefreshed({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    const retryHeaders = new Headers(init?.headers);
    retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
    return fetch(input, { ...init, headers: retryHeaders });
  };
}

// ─────────────────────────────────────────────────────────────
// buildApiShape
// ─────────────────────────────────────────────────────────────

function buildApiShape(core: {
  auth: Auth;
  favorites: Favorites;
  images: Images;
  meetings: Meetings;
  meetingTypes: MeetingTypes;
  notifications: Notifications;
  posts: Posts;
  reviews: Reviews;
  user: Users;
}) {
  return {
    auth: {
      login: (data: Parameters<typeof core.auth.loginCreate>[1]) => core.auth.loginCreate(teamId, data),
      signup: (data: Parameters<typeof core.auth.signupCreate>[1]) => core.auth.signupCreate(teamId, data),
      logout: (data: Parameters<typeof core.auth.logoutCreate>[1]) => core.auth.logoutCreate(teamId, data),
      refresh: (data: Parameters<typeof core.auth.refreshCreate>[1]) => core.auth.refreshCreate(teamId, data),
      googleOAuth: () => core.auth.googleList(teamId),
      kakaoOAuth: () => core.auth.kakaoList(teamId),
      googleCallback: core.auth.googleCallbackList,
      kakaoCallback: core.auth.kakaoCallbackList,
    },
    user: {
      getUser: () => core.user.getUsers(teamId),
      patchUser: (data: Parameters<typeof core.user.patchUsers>[1]) => core.user.patchUsers(teamId, data),
      getUserDetail: (userId: number) => core.user.usersDetail(teamId, userId),
      getMeetingsList: () => core.user.meMeetingsList(teamId),
      getReviewsList: () => core.user.meReviewsList(teamId),
    },
    meetings: {
      getJoined: (
        query?: Parameters<typeof core.meetings.joinedList>[1],
        params?: Parameters<typeof core.meetings.joinedList>[2],
      ) => core.meetings.joinedList(teamId, query, params),
      getCreated: () => core.meetings.getMeetings(teamId),
      getList: (
        query?: Parameters<typeof core.meetings.meetingsList>[1],
        params?: Parameters<typeof core.meetings.meetingsList>[2],
      ) => core.meetings.meetingsList(teamId, query, params),
      getDetail: (meetingId: Parameters<typeof core.meetings.meetingsDetail>[1]) =>
        core.meetings.meetingsDetail(teamId, meetingId),
      getReviewsList: (
        meetingId: Parameters<typeof core.reviews.reviewsList2>[1],
        query?: Parameters<typeof core.reviews.reviewsList2>[2],
        params?: Parameters<typeof core.reviews.reviewsList2>[3],
      ) => core.reviews.reviewsList2(teamId, meetingId, query, params),

      create: (
        // meetingsApi에 create, join, cancelJoin, delete 추가
        data: Parameters<typeof core.meetings.meetingsCreate>[1],
        params?: Parameters<typeof core.meetings.meetingsCreate>[2],
      ) => core.meetings.meetingsCreate(teamId, data, params),
      join: (meetingId: number, params?: Parameters<typeof core.meetings.joinCreate>[2]) =>
        core.meetings.joinCreate(teamId, meetingId, params),
      cancelJoin: (meetingId: number, params?: Parameters<typeof core.meetings.joinDelete>[2]) =>
        core.meetings.joinDelete(teamId, meetingId, params),
      delete: (meetingId: number, params?: Parameters<typeof core.meetings.meetingsDelete>[2]) =>
        core.meetings.meetingsDelete(teamId, meetingId, params),
      update: (
        meetingId: Parameters<typeof core.meetings.meetingsPartialUpdate>[1],
        data: Parameters<typeof core.meetings.meetingsPartialUpdate>[2],
        params?: Parameters<typeof core.meetings.meetingsPartialUpdate>[3],
      ) => core.meetings.meetingsPartialUpdate(teamId, meetingId, data, params),

      // getList 추가
      participants: {
        getList: (
          meetingId: Parameters<typeof core.meetings.participantsList>[1],
          params?: Parameters<typeof core.meetings.participantsList>[2],
        ) => core.meetings.participantsList(teamId, meetingId, params),
      },
    },
    favorites: {
      getList: (
        query?: Parameters<typeof core.favorites.favoritesList>[1],
        params?: Parameters<typeof core.favorites.favoritesList>[2],
      ) => core.favorites.favoritesList(teamId, query, params),
      getCount: (params?: Parameters<typeof core.favorites.countList>[1]) => core.favorites.countList(teamId, params),
      create: (
        meetingId: Parameters<typeof core.favorites.favoritesCreate>[1],
        params?: Parameters<typeof core.favorites.favoritesCreate>[2],
      ) => core.favorites.favoritesCreate(teamId, meetingId, params),
      delete: (
        meetingId: Parameters<typeof core.favorites.favoritesDelete>[1],
        params?: Parameters<typeof core.favorites.favoritesDelete>[2],
      ) => core.favorites.favoritesDelete(teamId, meetingId, params),
    },
    images: {
      create: (
        data: Parameters<typeof core.images.imagesCreate>[1],
        params?: Parameters<typeof core.images.imagesCreate>[2],
      ) => core.images.imagesCreate(teamId, data, params),
    },
    meetingTypes: {
      getList: (params?: Parameters<typeof core.meetingTypes.meetingTypesList>[1]) =>
        core.meetingTypes.meetingTypesList(teamId, params),
      create: (
        data: Parameters<typeof core.meetingTypes.meetingTypesCreate>[1],
        params?: Parameters<typeof core.meetingTypes.meetingTypesCreate>[2],
      ) => core.meetingTypes.meetingTypesCreate(teamId, data, params),
      update: (
        typeId: Parameters<typeof core.meetingTypes.meetingTypesPartialUpdate>[1],
        data: Parameters<typeof core.meetingTypes.meetingTypesPartialUpdate>[2],
        params?: Parameters<typeof core.meetingTypes.meetingTypesPartialUpdate>[3],
      ) => core.meetingTypes.meetingTypesPartialUpdate(teamId, typeId, data, params),
      delete: (
        typeId: Parameters<typeof core.meetingTypes.meetingTypesDelete>[1],
        params?: Parameters<typeof core.meetingTypes.meetingTypesDelete>[2],
      ) => core.meetingTypes.meetingTypesDelete(teamId, typeId, params),
    },
    notifications: {
      getList: (
        query?: Parameters<typeof core.notifications.notificationsList>[1],
        params?: Parameters<typeof core.notifications.notificationsList>[2],
      ) => core.notifications.notificationsList(teamId, query, params),
      delete: (
        notificationId: Parameters<typeof core.notifications.notificationsDelete2>[1],
        params?: Parameters<typeof core.notifications.notificationsDelete2>[2],
      ) => core.notifications.notificationsDelete2(teamId, notificationId, params),
      deleteAll: (params?: Parameters<typeof core.notifications.notificationsDelete>[1]) =>
        core.notifications.notificationsDelete(teamId, params),
      read: (
        notificationId: Parameters<typeof core.notifications.readUpdate>[1],
        params?: Parameters<typeof core.notifications.readUpdate>[2],
      ) => core.notifications.readUpdate(teamId, notificationId, params),
      readAll: (params?: Parameters<typeof core.notifications.readAllUpdate>[1]) =>
        core.notifications.readAllUpdate(teamId, params),
    },
    posts: {
      getList: (
        query?: Parameters<typeof core.posts.postsList>[1],
        params?: Parameters<typeof core.posts.postsList>[2],
      ) => core.posts.postsList(teamId, query, params),
      create: (
        data: Parameters<typeof core.posts.postsCreate>[1],
        params?: Parameters<typeof core.posts.postsCreate>[2],
      ) => core.posts.postsCreate(teamId, data, params),
      getDetail: (
        postId: Parameters<typeof core.posts.postsDetail>[1],
        params?: Parameters<typeof core.posts.postsDetail>[2],
      ) => core.posts.postsDetail(teamId, postId, params),
      update: (
        postId: Parameters<typeof core.posts.postsPartialUpdate>[1],
        data: Parameters<typeof core.posts.postsPartialUpdate>[2],
        params?: Parameters<typeof core.posts.postsPartialUpdate>[3],
      ) => core.posts.postsPartialUpdate(teamId, postId, data, params),
      delete: (
        postId: Parameters<typeof core.posts.postsDelete>[1],
        params?: Parameters<typeof core.posts.postsDelete>[2],
      ) => core.posts.postsDelete(teamId, postId, params),
      comments: {
        create: (
          postId: Parameters<typeof core.posts.commentsCreate>[1],
          data: Parameters<typeof core.posts.commentsCreate>[2],
          params?: Parameters<typeof core.posts.commentsCreate>[3],
        ) => core.posts.commentsCreate(teamId, postId, data, params),
        getList: (
          postId: Parameters<typeof core.posts.commentsList>[1],
          query?: Parameters<typeof core.posts.commentsList>[2],
          params?: Parameters<typeof core.posts.commentsList>[3],
        ) => core.posts.commentsList(teamId, postId, query, params),
        update: (
          postId: Parameters<typeof core.posts.commentsPartialUpdate>[1],
          commentId: Parameters<typeof core.posts.commentsPartialUpdate>[2],
          data: Parameters<typeof core.posts.commentsPartialUpdate>[3],
          params?: Parameters<typeof core.posts.commentsPartialUpdate>[4],
        ) => core.posts.commentsPartialUpdate(teamId, postId, commentId, data, params),
        delete: (
          postId: Parameters<typeof core.posts.commentsDelete>[1],
          commentId: Parameters<typeof core.posts.commentsDelete>[2],
          params?: Parameters<typeof core.posts.commentsDelete>[3],
        ) => core.posts.commentsDelete(teamId, postId, commentId, params),
      },
      likes: {
        create: (
          postId: Parameters<typeof core.posts.likeCreate>[1],
          params?: Parameters<typeof core.posts.likeCreate>[2],
        ) => core.posts.likeCreate(teamId, postId, params),
        delete: (
          postId: Parameters<typeof core.posts.likeDelete>[1],
          params?: Parameters<typeof core.posts.likeDelete>[2],
        ) => core.posts.likeDelete(teamId, postId, params),
      },
    },
    reviews: {
      getList: (
        query?: Parameters<typeof core.reviews.reviewsList>[1],
        params?: Parameters<typeof core.reviews.reviewsList>[2],
      ) => core.reviews.reviewsList(teamId, query, params),
      getStatistics: (params?: Parameters<typeof core.reviews.statisticsList>[1]) =>
        core.reviews.statisticsList(teamId, params),
      getCategoriesStatistics: (params?: Parameters<typeof core.reviews.categoriesStatisticsList>[1]) =>
        core.reviews.categoriesStatisticsList(teamId, params),
      update: (
        reviewId: Parameters<typeof core.reviews.reviewsPartialUpdate>[1],
        data: Parameters<typeof core.reviews.reviewsPartialUpdate>[2],
        params?: Parameters<typeof core.reviews.reviewsPartialUpdate>[3],
      ) => core.reviews.reviewsPartialUpdate(teamId, reviewId, data, params),
      delete: (
        reviewId: Parameters<typeof core.reviews.reviewsDelete>[1],
        params?: Parameters<typeof core.reviews.reviewsDelete>[2],
      ) => core.reviews.reviewsDelete(teamId, reviewId, params),
      createByMeeting: (
        meetingId: Parameters<typeof core.reviews.reviewsCreate>[1],
        data: Parameters<typeof core.reviews.reviewsCreate>[2],
        params?: Parameters<typeof core.reviews.reviewsCreate>[3],
      ) => core.reviews.reviewsCreate(teamId, meetingId, data, params),
      getListByMeeting: (
        meetingId: Parameters<typeof core.reviews.reviewsList2>[1],
        query?: Parameters<typeof core.reviews.reviewsList2>[2],
        params?: Parameters<typeof core.reviews.reviewsList2>[3],
      ) => core.reviews.reviewsList2(teamId, meetingId, query, params),
    },
  };
}

// ─────────────────────────────────────────────────────────────
// publicCore 싱글턴
// ─────────────────────────────────────────────────────────────

const publicCore = {
  auth: new Auth({ baseUrl }),
  favorites: new Favorites({ baseUrl }),
  images: new Images({ baseUrl }),
  meetings: new Meetings({ baseUrl }),
  meetingTypes: new MeetingTypes({ baseUrl }),
  notifications: new Notifications({ baseUrl }),
  posts: new Posts({ baseUrl }),
  reviews: new Reviews({ baseUrl }),
  user: new Users({ baseUrl }),
};

/**
 * 인증이 불필요한 API 객체 (클라이언트/서버 공용)
 * @example
 * const meetings = await api.meetings.getList();
 */
export const api = buildApiShape(publicCore);

// ─────────────────────────────────────────────────────────────
// createApiClient
//
// @param getAccessToken    현재 유효한 accessToken 반환 함수
// @param getRefreshToken   현재 유효한 refreshToken 반환 함수
// @param onTokenRefreshed  갱신된 토큰을 저장할 콜백 (쿠키 set 등)
// @param onAuthFailed      갱신 실패 시 처리할 콜백 (쿠키 삭제 + redirect 등)
// ─────────────────────────────────────────────────────────────

export function createApiClient(
  getAccessToken: () => string | undefined,
  getRefreshToken: () => string | undefined,
  onTokenRefreshed: (tokens: { accessToken: string; refreshToken: string }) => Promise<void> | void,
  onAuthFailed: () => Promise<void> | void,
) {
  const customFetch = createAuthFetch(getAccessToken, getRefreshToken, onTokenRefreshed, onAuthFailed);

  const core = {
    auth: new Auth({ baseUrl, customFetch }),
    favorites: new Favorites({ baseUrl, customFetch }),
    images: new Images({ baseUrl, customFetch }),
    meetings: new Meetings({ baseUrl, customFetch }),
    meetingTypes: new MeetingTypes({ baseUrl, customFetch }),
    notifications: new Notifications({ baseUrl, customFetch }),
    posts: new Posts({ baseUrl, customFetch }),
    reviews: new Reviews({ baseUrl, customFetch }),
    user: new Users({ baseUrl, customFetch }),
  };

  return buildApiShape(core);
}

/** createApiClient 반환 타입 — 호출부에서 타입 추론용 */
export type ApiClient = ReturnType<typeof createApiClient>;
