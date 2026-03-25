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

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://dallaem-backend.vercel.app";
const teamId = process.env.NEXT_PUBLIC_TEAM_ID || "dallaem";

/**
 * 인증이 필요한 API 호출 시 사용
 * 쿠키에서 accessToken을 자동으로 읽어 Authorization 헤더에 주입합니다
 * 서버 컴포넌트 / 서버 액션 전용
 *
 * @example
 * const authedApi = await getAuthenticatedApi()
 * const data = await authedApi.user.getUser()
 */
export async function getAuthenticatedApi() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const securityWorker = () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

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
  };
}

/**
 * 로그인 여부 확인이 필요할 때 사용
 *
 * @example
 * if (!(await isAuthenticated())) redirect("/login")
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("access_token")?.value;
}
