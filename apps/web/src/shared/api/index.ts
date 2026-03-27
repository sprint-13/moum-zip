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
import { cookies } from "next/headers";
import { TokenService } from "@/entities/auth/model/token-service";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://dallaem-backend.vercel.app";
const teamId = process.env.NEXT_PUBLIC_TEAM_ID || "dallaem";

// ─────────────────────────────────────────────
// Public API (인증 불필요, 클라이언트/서버 공용)
// 토큰 없이 호출 가능한 엔드포인트 모음 (로그인, 회원가입, 목록 조회 등)
// 클라이언트 컴포넌트 및 use-case Deps 기본값으로 사용
// 인증이 필요한 요청은 apiClient() 사용
// ─────────────────────────────────────────────

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

export const api = {
  auth: {
    login: (data: Parameters<typeof publicCore.auth.loginCreate>[1]) => publicCore.auth.loginCreate(teamId, data),
    signup: (data: Parameters<typeof publicCore.auth.signupCreate>[1]) => publicCore.auth.signupCreate(teamId, data),
    logout: (data: Parameters<typeof publicCore.auth.logoutCreate>[1]) => publicCore.auth.logoutCreate(teamId, data),
    refresh: (data: Parameters<typeof publicCore.auth.refreshCreate>[1]) => publicCore.auth.refreshCreate(teamId, data),
    googleOAuth: () => publicCore.auth.googleList(teamId),
    kakaoOAuth: () => publicCore.auth.kakaoList(teamId),
    googleCallback: publicCore.auth.googleCallbackList,
    kakaoCallback: publicCore.auth.kakaoCallbackList,
  },

  user: {
    getUser: () => publicCore.user.getUsers(teamId),
    patchUser: (data: Parameters<typeof publicCore.user.patchUsers>[1]) => publicCore.user.patchUsers(teamId, data),
    getUserDetail: (userId: number) => publicCore.user.usersDetail(teamId, userId),
    getMeetingsList: () => publicCore.user.meMeetingsList(teamId),
    getReviewsList: () => publicCore.user.meReviewsList(teamId),
  },

  meetings: {
    getJoined: (
      query?: Parameters<typeof publicCore.meetings.joinedList>[1],
      params?: Parameters<typeof publicCore.meetings.joinedList>[2],
    ) => publicCore.meetings.joinedList(teamId, query, params),
    getCreated: () => publicCore.meetings.getMeetings(teamId),
    getList: (
      query?: Parameters<typeof publicCore.meetings.meetingsList>[1],
      params?: Parameters<typeof publicCore.meetings.meetingsList>[2],
    ) => publicCore.meetings.meetingsList(teamId, query, params),
    getDetail: (meetingId: Parameters<typeof publicCore.meetings.meetingsDetail>[1]) =>
      publicCore.meetings.meetingsDetail(teamId, meetingId),
    getReviewsList: (
      meetingId: Parameters<typeof publicCore.reviews.reviewsList2>[1],
      query?: Parameters<typeof publicCore.reviews.reviewsList2>[2],
      params?: Parameters<typeof publicCore.reviews.reviewsList2>[3],
    ) => publicCore.reviews.reviewsList2(teamId, meetingId, query, params),
  },

  favorites: {
    getList: (
      query?: Parameters<typeof publicCore.favorites.favoritesList>[1],
      params?: Parameters<typeof publicCore.favorites.favoritesList>[2],
    ) => publicCore.favorites.favoritesList(teamId, query, params),
    getCount: (params?: Parameters<typeof publicCore.favorites.countList>[1]) =>
      publicCore.favorites.countList(teamId, params),
    create: (
      meetingId: Parameters<typeof publicCore.favorites.favoritesCreate>[1],
      params?: Parameters<typeof publicCore.favorites.favoritesCreate>[2],
    ) => publicCore.favorites.favoritesCreate(teamId, meetingId, params),
    delete: (
      meetingId: Parameters<typeof publicCore.favorites.favoritesDelete>[1],
      params?: Parameters<typeof publicCore.favorites.favoritesDelete>[2],
    ) => publicCore.favorites.favoritesDelete(teamId, meetingId, params),
  },

  images: {
    create: (
      data: Parameters<typeof publicCore.images.imagesCreate>[1],
      params?: Parameters<typeof publicCore.images.imagesCreate>[2],
    ) => publicCore.images.imagesCreate(teamId, data, params),
  },

  meetingTypes: {
    getList: (params?: Parameters<typeof publicCore.meetingTypes.meetingTypesList>[1]) =>
      publicCore.meetingTypes.meetingTypesList(teamId, params),
    create: (
      data: Parameters<typeof publicCore.meetingTypes.meetingTypesCreate>[1],
      params?: Parameters<typeof publicCore.meetingTypes.meetingTypesCreate>[2],
    ) => publicCore.meetingTypes.meetingTypesCreate(teamId, data, params),
    update: (
      typeId: Parameters<typeof publicCore.meetingTypes.meetingTypesPartialUpdate>[1],
      data: Parameters<typeof publicCore.meetingTypes.meetingTypesPartialUpdate>[2],
      params?: Parameters<typeof publicCore.meetingTypes.meetingTypesPartialUpdate>[3],
    ) => publicCore.meetingTypes.meetingTypesPartialUpdate(teamId, typeId, data, params),
    delete: (
      typeId: Parameters<typeof publicCore.meetingTypes.meetingTypesDelete>[1],
      params?: Parameters<typeof publicCore.meetingTypes.meetingTypesDelete>[2],
    ) => publicCore.meetingTypes.meetingTypesDelete(teamId, typeId, params),
  },

  notifications: {
    getList: (
      query?: Parameters<typeof publicCore.notifications.notificationsList>[1],
      params?: Parameters<typeof publicCore.notifications.notificationsList>[2],
    ) => publicCore.notifications.notificationsList(teamId, query, params),
    delete: (
      notificationId: Parameters<typeof publicCore.notifications.notificationsDelete2>[1],
      params?: Parameters<typeof publicCore.notifications.notificationsDelete2>[2],
    ) => publicCore.notifications.notificationsDelete2(teamId, notificationId, params),
    deleteAll: (params?: Parameters<typeof publicCore.notifications.notificationsDelete>[1]) =>
      publicCore.notifications.notificationsDelete(teamId, params),
    read: (
      notificationId: Parameters<typeof publicCore.notifications.readUpdate>[1],
      params?: Parameters<typeof publicCore.notifications.readUpdate>[2],
    ) => publicCore.notifications.readUpdate(teamId, notificationId, params),
    readAll: (params?: Parameters<typeof publicCore.notifications.readAllUpdate>[1]) =>
      publicCore.notifications.readAllUpdate(teamId, params),
  },

  posts: {
    getList: (
      query?: Parameters<typeof publicCore.posts.postsList>[1],
      params?: Parameters<typeof publicCore.posts.postsList>[2],
    ) => publicCore.posts.postsList(teamId, query, params),
    create: (
      data: Parameters<typeof publicCore.posts.postsCreate>[1],
      params?: Parameters<typeof publicCore.posts.postsCreate>[2],
    ) => publicCore.posts.postsCreate(teamId, data, params),
    getDetail: (
      postId: Parameters<typeof publicCore.posts.postsDetail>[1],
      params?: Parameters<typeof publicCore.posts.postsDetail>[2],
    ) => publicCore.posts.postsDetail(teamId, postId, params),
    update: (
      postId: Parameters<typeof publicCore.posts.postsPartialUpdate>[1],
      data: Parameters<typeof publicCore.posts.postsPartialUpdate>[2],
      params?: Parameters<typeof publicCore.posts.postsPartialUpdate>[3],
    ) => publicCore.posts.postsPartialUpdate(teamId, postId, data, params),
    delete: (
      postId: Parameters<typeof publicCore.posts.postsDelete>[1],
      params?: Parameters<typeof publicCore.posts.postsDelete>[2],
    ) => publicCore.posts.postsDelete(teamId, postId, params),
    comments: {
      create: (
        postId: Parameters<typeof publicCore.posts.commentsCreate>[1],
        data: Parameters<typeof publicCore.posts.commentsCreate>[2],
        params?: Parameters<typeof publicCore.posts.commentsCreate>[3],
      ) => publicCore.posts.commentsCreate(teamId, postId, data, params),
      getList: (
        postId: Parameters<typeof publicCore.posts.commentsList>[1],
        query?: Parameters<typeof publicCore.posts.commentsList>[2],
        params?: Parameters<typeof publicCore.posts.commentsList>[3],
      ) => publicCore.posts.commentsList(teamId, postId, query, params),
      update: (
        postId: Parameters<typeof publicCore.posts.commentsPartialUpdate>[1],
        commentId: Parameters<typeof publicCore.posts.commentsPartialUpdate>[2],
        data: Parameters<typeof publicCore.posts.commentsPartialUpdate>[3],
        params?: Parameters<typeof publicCore.posts.commentsPartialUpdate>[4],
      ) => publicCore.posts.commentsPartialUpdate(teamId, postId, commentId, data, params),
      delete: (
        postId: Parameters<typeof publicCore.posts.commentsDelete>[1],
        commentId: Parameters<typeof publicCore.posts.commentsDelete>[2],
        params?: Parameters<typeof publicCore.posts.commentsDelete>[3],
      ) => publicCore.posts.commentsDelete(teamId, postId, commentId, params),
    },
    likes: {
      create: (
        postId: Parameters<typeof publicCore.posts.likeCreate>[1],
        params?: Parameters<typeof publicCore.posts.likeCreate>[2],
      ) => publicCore.posts.likeCreate(teamId, postId, params),
      delete: (
        postId: Parameters<typeof publicCore.posts.likeDelete>[1],
        params?: Parameters<typeof publicCore.posts.likeDelete>[2],
      ) => publicCore.posts.likeDelete(teamId, postId, params),
    },
  },

  reviews: {
    getList: (
      query?: Parameters<typeof publicCore.reviews.reviewsList>[1],
      params?: Parameters<typeof publicCore.reviews.reviewsList>[2],
    ) => publicCore.reviews.reviewsList(teamId, query, params),
    getStatistics: (params?: Parameters<typeof publicCore.reviews.statisticsList>[1]) =>
      publicCore.reviews.statisticsList(teamId, params),
    getCategoriesStatistics: (params?: Parameters<typeof publicCore.reviews.categoriesStatisticsList>[1]) =>
      publicCore.reviews.categoriesStatisticsList(teamId, params),
    update: (
      reviewId: Parameters<typeof publicCore.reviews.reviewsPartialUpdate>[1],
      data: Parameters<typeof publicCore.reviews.reviewsPartialUpdate>[2],
      params?: Parameters<typeof publicCore.reviews.reviewsPartialUpdate>[3],
    ) => publicCore.reviews.reviewsPartialUpdate(teamId, reviewId, data, params),
    delete: (
      reviewId: Parameters<typeof publicCore.reviews.reviewsDelete>[1],
      params?: Parameters<typeof publicCore.reviews.reviewsDelete>[2],
    ) => publicCore.reviews.reviewsDelete(teamId, reviewId, params),
    createByMeeting: (
      meetingId: Parameters<typeof publicCore.reviews.reviewsCreate>[1],
      data: Parameters<typeof publicCore.reviews.reviewsCreate>[2],
      params?: Parameters<typeof publicCore.reviews.reviewsCreate>[3],
    ) => publicCore.reviews.reviewsCreate(teamId, meetingId, data, params),
    getListByMeeting: (
      meetingId: Parameters<typeof publicCore.reviews.reviewsList2>[1],
      query?: Parameters<typeof publicCore.reviews.reviewsList2>[2],
      params?: Parameters<typeof publicCore.reviews.reviewsList2>[3],
    ) => publicCore.reviews.reviewsList2(teamId, meetingId, query, params),
  },
};

// ─────────────────────────────────────────────
// Authenticated API (서버 컴포넌트 / 서버 액션 전용)
// 쿠키에서 accessToken을 읽어 Authorization 헤더에 자동 주입
// 인증이 필요한 API는 withAuth()로 감싸서 사용
// 인증이 불필요한 API는 api 객체 직접 사용
// ─────────────────────────────────────────────

/**
 * 인증이 필요한 API 호출 시 withAuth()와 함께 사용
 * 서버 컴포넌트 / 서버 액션 전용
 *
 * @example
 * // 인증 필요한 API → withAuth로 감싸서 사용
 * const data = await withAuth((client) => client.user.getUser());
 *
 * // 인증 불필요한 API → api 객체 직접 사용
 * const meetings = await api.meetings.getList();
 */

export async function apiClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const securityWorker = accessToken ? () => ({ headers: { Authorization: `Bearer ${accessToken}` } }) : () => ({});

  const core = {
    auth: new Auth({ baseUrl, securityWorker }),
    favorites: new Favorites({ baseUrl, securityWorker }),
    images: new Images({ baseUrl, securityWorker }),
    meetings: new Meetings({ baseUrl, securityWorker }),
    meetingTypes: new MeetingTypes({ baseUrl, securityWorker }),
    notifications: new Notifications({ baseUrl, securityWorker }),
    posts: new Posts({ baseUrl, securityWorker }),
    reviews: new Reviews({ baseUrl, securityWorker }),
    user: new Users({ baseUrl, securityWorker }),
  };

  return {
    auth: {
      logout: (data: Parameters<typeof core.auth.logoutCreate>[1]) => core.auth.logoutCreate(teamId, data),
      refresh: (data: Parameters<typeof core.auth.refreshCreate>[1]) => core.auth.refreshCreate(teamId, data),
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

// ─────────────────────────────────────────────
// Auth helpers (서버 전용)
// ─────────────────────────────────────────────

/**
 * 토큰 유효성 검증 + userId 반환
 * @example
 * const { authenticated, userId } = await isAuth()
 */
export async function isAuth(): Promise<{ authenticated: boolean; userId: number | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token || !TokenService.isValid(token)) {
    return { authenticated: false, userId: null };
  }

  const payload = TokenService.decode(token);
  return { authenticated: true, userId: payload ? Number(payload.sub) : null };
}
