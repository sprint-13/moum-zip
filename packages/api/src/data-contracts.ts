/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** @example 1 */
  id: number;
  /** @example "dallaem" */
  teamId: string;
  /**
   * @format email
   * @example "test@example.com"
   */
  email: string;
  /** @example "홍길동" */
  name: string;
  /** @example "코드잇" */
  companyName: string | null;
  /** @example null */
  image: string | null;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

export interface SignupRequest {
  /**
   * @format email
   * @example "test@example.com"
   */
  email: string;
  /**
   * 최소 8자
   * @minLength 8
   * @example "password123"
   */
  password: string;
  /**
   * @minLength 1
   * @maxLength 20
   * @example "홍길동"
   */
  name: string;
  /**
   * @maxLength 50
   * @example "코드잇"
   */
  companyName?: string;
}

export interface LoginResponse {
  user: User;
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  accessToken: string;
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  refreshToken: string;
}

export interface LoginRequest {
  /**
   * @format email
   * @example "test@example.com"
   */
  email: string;
  /** @example "password123" */
  password: string;
}

export interface RefreshRequest {
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  refreshToken: string;
}

export interface AuthTokens {
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  accessToken: string;
  /** @example "eyJhbGciOiJIUzI1NiIs..." */
  refreshToken: string;
}

export interface UpdateUserRequest {
  /**
   * @minLength 1
   * @maxLength 20
   * @example "김철수"
   */
  name?: string;
  /**
   * @maxLength 50
   * @example "네이버"
   */
  companyName?: string;
  /**
   * @format uri
   * @example "https://example.com/image.jpg"
   */
  image?: string;
}

export interface PublicUser {
  /** @example 1 */
  id: number;
  /** @example "dallaem" */
  teamId: string;
  /**
   * @format email
   * @example "test@example.com"
   */
  email: string;
  /** @example "홍길동" */
  name: string;
  /** @example "코드잇" */
  companyName: string | null;
  /** @example null */
  image: string | null;
}

export interface UserMeetingsResponse {
  data: UserMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UserMeeting {
  /** @example 1 */
  id: number;
  /** @example "달램핏 모임" */
  name: string;
  /**
   * @format date-time
   * @example "2026-02-10T14:00:00Z"
   */
  dateTime: string;
  /** @example "강남" */
  region: string;
  /** @example 5 */
  participantCount: number;
  /** @example 10 */
  capacity: number;
  /** @example false */
  isReviewed?: boolean;
  /** @example "participant" */
  role: "participant" | "host";
}

export interface UserReviewsResponse {
  data: UserReview[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UserReview {
  /** @example 1 */
  id: number;
  /** @example 5 */
  score: number;
  /** @example "너무 좋았어요!" */
  comment: string;
  /** @example 123 */
  meetingId: number;
  meeting: {
    /** @example 123 */
    id: number;
    /** @example "달램핏 모임" */
    name: string;
    /**
     * @format date-time
     * @example "2026-02-01T14:00:00Z"
     */
    dateTime: string;
  };
  /**
   * @format date-time
   * @example "2026-02-01T20:00:00Z"
   */
  createdAt: string;
}

export interface JoinedMeetingList {
  data: JoinedMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type JoinedMeeting = MeetingWithHost & {
  /**
   * @format date-time
   * @example "2026-02-01T10:00:00.000Z"
   */
  joinedAt: string | null;
  /** @example false */
  isReviewed: boolean;
  /** @example false */
  isCompleted: boolean;
};

export interface Host {
  /** @example 1 */
  id: number;
  /** @example "홍길동" */
  name: string;
  /** @example "https://example.com/profile.jpg" */
  image: string | null;
}

export type MeetingWithHost = Meeting & {
  host: Host;
};

export interface Meeting {
  /** @example 1 */
  id: number;
  /** @example "dallaem" */
  teamId: string;
  /** @example "달램핏 모임" */
  name: string;
  /** @example "달램핏" */
  type: string;
  /** @example "건대입구" */
  region: string;
  /** @example "서울시 광진구 자양동 123-45" */
  address: string | null;
  /** @example 37.5407 */
  latitude: number | null;
  /** @example 127.0693 */
  longitude: number | null;
  /**
   * @format date-time
   * @example "2026-02-10T14:00:00.000Z"
   */
  dateTime: string | null;
  /**
   * @format date-time
   * @example "2026-02-09T23:59:59.000Z"
   */
  registrationEnd: string | null;
  /** @example 10 */
  capacity: number;
  /** @example 5 */
  participantCount: number;
  /** @example "https://example.com/meeting.jpg" */
  image: string | null;
  /** @example "함께 운동하며 건강을 챙겨요!" */
  description: string | null;
  /**
   * @format date-time
   * @example null
   */
  canceledAt: string | null;
  /**
   * @format date-time
   * @example null
   */
  confirmedAt: string | null;
  /** @example 1 */
  hostId: number;
  /** @example 1 */
  createdBy: number;
  /**
   * @format date-time
   * @example "2026-02-01T10:00:00.000Z"
   */
  createdAt: string | null;
  /**
   * @format date-time
   * @example "2026-02-01T10:00:00.000Z"
   */
  updatedAt: string | null;
}

export interface MeetingList {
  data: MeetingWithHost[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CreateMeeting {
  /**
   * @minLength 1
   * @maxLength 100
   * @example "달램핏 모임"
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 50
   * @example "달램핏"
   */
  type: string;
  /**
   * 카카오맵 주소에서 추출한 시/도 + 구/군 (예: '서울 강남구', '경기 성남시 분당구')
   * @minLength 1
   * @maxLength 100
   * @example "서울 강남구"
   */
  region: string;
  /**
   * 카카오맵 장소명 + 도로명주소 + 상세주소 (쉼표 구분)
   * @maxLength 200
   * @example "스타벅스 강남역점, 서울 강남구 강남대로 390, 3층"
   */
  address?: string;
  /**
   * 카카오맵에서 반환된 위도
   * @min -90
   * @max 90
   * @example 37.4979
   */
  latitude?: number;
  /**
   * 카카오맵에서 반환된 경도
   * @min -180
   * @max 180
   * @example 127.0276
   */
  longitude?: number;
  /**
   * @format date-time
   * @example "2026-02-01T14:00:00.000Z"
   */
  dateTime: string | null;
  /**
   * @format date-time
   * @example "2026-01-31T23:59:59.000Z"
   */
  registrationEnd: string | null;
  /**
   * @min 1
   * @max 1000
   * @example 20
   */
  capacity: number;
  /**
   * @format uri
   * @example "https://example.com/image.jpg"
   */
  image?: string;
  /**
   * @maxLength 1000
   * @example "함께 운동하며 건강을 챙겨요!"
   */
  description?: string;
}

export interface UpdateMeeting {
  /**
   * @minLength 1
   * @maxLength 100
   */
  name?: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  type?: string;
  /**
   * @minLength 1
   * @maxLength 100
   */
  region?: string;
  /** @maxLength 200 */
  address?: string;
  /**
   * @min -90
   * @max 90
   */
  latitude?: number;
  /**
   * @min -180
   * @max 180
   */
  longitude?: number;
  /** @format date-time */
  dateTime?: string | null;
  /** @format date-time */
  registrationEnd?: string | null;
  /**
   * @min 1
   * @max 1000
   */
  capacity?: number;
  /** @format uri */
  image?: string;
  /** @maxLength 1000 */
  description?: string;
}

export interface ParticipantList {
  data: Participant[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Participant {
  /** @example 1 */
  id: number;
  /** @example "dallaem" */
  teamId: string;
  /** @example 1 */
  meetingId: number;
  /** @example 2 */
  userId: number;
  /**
   * @format date-time
   * @example "2026-02-01T10:00:00.000Z"
   */
  joinedAt: string | null;
  user?: {
    /** @example 2 */
    id: number;
    /** @example "김철수" */
    name: string;
    /** @example null */
    image: string | null;
  };
}

export interface UpdateMeetingStatus {
  /**
   * 변경할 상태 - CONFIRMED: 확정, CANCELED: 취소
   * @example "CONFIRMED"
   */
  status: "CONFIRMED" | "CANCELED";
}

export type MeetingTypeList = MeetingType[];

export interface MeetingType {
  /** @example 1 */
  id: number;
  /** @example "team-1" */
  teamId: string;
  /** @example "달램핏" */
  name: string;
  /** @example "달램핏 모임입니다" */
  description: string | null;
  /**
   * @format date-time
   * @example "2026-01-28T12:00:00.000Z"
   */
  createdAt: string | null;
}

export interface CreateMeetingType {
  /**
   * @minLength 1
   * @maxLength 50
   * @example "달램핏"
   */
  name: string;
  /**
   * @maxLength 200
   * @example "달램핏 모임입니다"
   */
  description?: string;
}

export interface UpdateMeetingType {
  /**
   * @minLength 1
   * @maxLength 50
   * @example "달램핏"
   */
  name?: string;
  /**
   * @maxLength 200
   * @example "달램핏 모임입니다"
   */
  description?: string;
}

export interface PaginatedReview {
  /** @example [{"id":1,"teamId":"dallaem","meetingId":10,"userId":2,"score":5,"comment":"너무 좋았어요!","createdAt":"2026-02-01T20:00:00.000Z","updatedAt":"2026-02-01T20:00:00.000Z","user":{"id":2,"name":"김철수","image":null},"meeting":{"id":10,"name":"달램핏 모임","type":"달램핏","region":"건대입구","image":"https://example.com/meeting.jpg","dateTime":"2026-02-10T14:00:00.000Z"}}] */
  data: ReviewWithDetails[];
  /** @example "eyJpZCI6MTB9" */
  nextCursor: string | null;
  /** @example true */
  hasMore: boolean;
}

export type ReviewWithDetails = Review & {
  user: {
    /** @example 2 */
    id: number;
    /** @example "김철수" */
    name: string;
    /** @example null */
    image: string | null;
  };
  meeting: {
    /** @example 10 */
    id: number;
    /** @example "달램핏 모임" */
    name: string;
    /** @example "달램핏" */
    type: string;
    /** @example "건대입구" */
    region: string;
    /** @example "https://example.com/meeting.jpg" */
    image: string | null;
    /**
     * @format date-time
     * @example "2026-02-10T14:00:00.000Z"
     */
    dateTime: string | null;
  };
};

export interface Review {
  /** @example 1 */
  id: number;
  /** @example "dallaem" */
  teamId: string;
  /** @example 10 */
  meetingId: number;
  /** @example 2 */
  userId: number;
  /** @example 5 */
  score: number;
  /** @example "너무 좋았어요!" */
  comment: string;
  /**
   * @format date-time
   * @example "2026-02-01T20:00:00.000Z"
   */
  createdAt: string | null;
  /**
   * @format date-time
   * @example "2026-02-01T20:00:00.000Z"
   */
  updatedAt: string | null;
}

export interface ReviewStatistics {
  /** @example 4.5 */
  averageScore: number;
  /** @example 42 */
  totalReviews: number;
  /** @example 1 */
  oneStar: number;
  /** @example 2 */
  twoStars: number;
  /** @example 5 */
  threeStars: number;
  /** @example 14 */
  fourStars: number;
  /** @example 20 */
  fiveStars: number;
}

export type CategoryStatistics = CategoryStatisticsItem[];

export interface CategoryStatisticsItem {
  /** @example "달램핏" */
  type: string;
  /** @example 4.7 */
  averageScore: number;
  /** @example 28 */
  totalReviews: number;
}

export interface UpdateReview {
  /**
   * @min 1
   * @max 5
   */
  score?: number;
  /**
   * @minLength 1
   * @maxLength 1000
   */
  comment?: string;
}

export interface CreateReviewByMeeting {
  /**
   * @min 1
   * @max 5
   * @example 5
   */
  score: number;
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "정말 좋은 모임이었습니다!"
   */
  comment: string;
}

export interface FavoriteList {
  data: FavoriteWithMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type FavoriteWithMeeting = Favorite & {
  meeting: MeetingWithHost;
};

export interface Favorite {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  /** @format date-time */
  createdAt: string | null;
}

export interface FavoriteCount {
  count: number;
}

export interface PresignedUrlResponse {
  /**
   * S3 presigned PUT URL (5분 유효)
   * @format uri
   */
  presignedUrl: string;
  /**
   * 업로드 완료 후 접근 가능한 공개 URL
   * @format uri
   */
  publicUrl: string;
}

export interface PresignedUrlRequest {
  /**
   * 업로드할 파일명 (확장자 포함)
   * @minLength 1
   */
  fileName: string;
  /** 이미지 MIME 타입 */
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  /**
   * 이미지 저장 폴더
   * @default "meetings"
   */
  folder?: "meetings" | "users" | "posts";
}

export interface PostList {
  data: PostWithAuthor[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type PostWithAuthor = Post & {
  author: Author;
  _count: {
    comments: number;
  };
};

export interface Author {
  id: number;
  name: string;
  image: string | null;
}

export interface Post {
  id: number;
  teamId: string;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  viewCount: number;
  likeCount: number;
  /** @format date-time */
  createdAt: string | null;
  /** @format date-time */
  updatedAt: string | null;
}

export interface CreatePost {
  /**
   * @minLength 1
   * @maxLength 200
   * @example "달램핏 후기"
   */
  title: string;
  /**
   * @minLength 1
   * @maxLength 50000
   * @example "정말 좋은 모임이었습니다."
   */
  content: string;
  /**
   * @format uri
   * @example "https://example.com/image.jpg"
   */
  image?: string;
}

export type PostWithComments = PostWithAuthor & {
  author?: Author & {
    email: string;
  };
  comments: Comment[];
  isLiked: boolean;
};

export interface Comment {
  id: number;
  teamId: string;
  postId: number;
  authorId: number;
  author: Author;
  content: string;
  /** @format date-time */
  createdAt: string | null;
  /** @format date-time */
  updatedAt: string | null;
}

export interface UpdatePost {
  /**
   * @minLength 1
   * @maxLength 200
   */
  title?: string;
  /**
   * @minLength 1
   * @maxLength 50000
   */
  content?: string;
  /** @format uri */
  image?: string | null;
}

export interface CreateComment {
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "좋은 글이네요!"
   */
  content: string;
}

export interface CommentList {
  data: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UpdateComment {
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "수정된 댓글입니다!"
   */
  content: string;
}

export interface PostLike {
  id: number;
  teamId: string;
  postId: number;
  userId: number;
  /** @format date-time */
  createdAt: string | null;
}

export interface NotificationList {
  data: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Notification {
  id: number;
  teamId: string;
  userId: number;
  type: "MEETING_CONFIRMED" | "MEETING_CANCELED" | "COMMENT";
  message: string;
  data: NotificationData;
  isRead: boolean;
  /** @format date-time */
  createdAt: string | null;
}

export type NotificationData = {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  image?: string | null;
};

export type SignupCreateData = User;

export type SignupCreateError = ErrorResponse;

export type LoginCreateData = LoginResponse;

export type LoginCreateError = ErrorResponse;

export type LogoutCreateData = any;

export type LogoutCreateError = ErrorResponse;

export type RefreshCreateData = AuthTokens;

export type RefreshCreateError = ErrorResponse;

export type GetUsersData = User;

export type GetUsersError = ErrorResponse;

export type PatchUsersData = User;

export type PatchUsersError = ErrorResponse;

export type UsersDetailData = PublicUser;

export type UsersDetailError = ErrorResponse;

export type MeMeetingsListData = UserMeetingsResponse;

export type MeMeetingsListError = ErrorResponse;

export type MeReviewsListData = UserReviewsResponse;

export type MeReviewsListError = ErrorResponse;

export type GoogleCallbackListError = ErrorResponse;

export type KakaoCallbackListError = ErrorResponse;

export type JoinedListData = JoinedMeetingList;

export type JoinedListError = ErrorResponse;

export type GetMeetingsData = MeetingList;

export type GetMeetingsError = ErrorResponse;

export type MeetingsListData = MeetingList;

export type MeetingsCreateData = MeetingWithHost;

export type MeetingsCreateError = ErrorResponse;

export type MeetingsDetailData = MeetingWithHost;

export type MeetingsDetailError = ErrorResponse;

export type MeetingsPartialUpdateData = MeetingWithHost;

export type MeetingsPartialUpdateError = ErrorResponse;

export interface MeetingsDeleteData {
  message: string;
}

export type MeetingsDeleteError = ErrorResponse;

export interface JoinCreateData {
  message: string;
}

export type JoinCreateError = ErrorResponse;

export interface JoinDeleteData {
  message: string;
}

export type JoinDeleteError = ErrorResponse;

export type ParticipantsListData = ParticipantList;

export type ParticipantsListError = ErrorResponse;

export type StatusPartialUpdateData = MeetingWithHost;

export type StatusPartialUpdateError = ErrorResponse;

export type MeetingTypesListData = MeetingTypeList;

export type MeetingTypesCreateData = MeetingType;

export type MeetingTypesCreateError = ErrorResponse;

export type MeetingTypesPartialUpdateData = MeetingType;

export type MeetingTypesPartialUpdateError = ErrorResponse;

export interface MeetingTypesDeleteData {
  message: string;
}

export type MeetingTypesDeleteError = ErrorResponse;

export type ReviewsListData = PaginatedReview;

export type StatisticsListData = ReviewStatistics;

export type CategoriesStatisticsListData = CategoryStatistics;

export type ReviewsPartialUpdateData = ReviewWithDetails;

export type ReviewsPartialUpdateError = ErrorResponse;

export interface ReviewsDeleteData {
  message: string;
}

export type ReviewsDeleteError = ErrorResponse;

export type ReviewsCreateData = ReviewWithDetails;

export type ReviewsCreateError = ErrorResponse;

export type ReviewsList2Data = PaginatedReview;

export type FavoritesListData = FavoriteList;

export type FavoritesListError = ErrorResponse;

export type CountListData = FavoriteCount;

export type CountListError = ErrorResponse;

export type FavoritesCreateData = FavoriteWithMeeting;

export type FavoritesCreateError = ErrorResponse;

export interface FavoritesDeleteData {
  message: string;
}

export type FavoritesDeleteError = ErrorResponse;

export type ImagesCreateData = PresignedUrlResponse;

export type PostsListData = PostList;

export type PostsCreateData = PostWithAuthor;

export type PostsCreateError = ErrorResponse;

export type PostsDetailData = PostWithComments;

export type PostsDetailError = ErrorResponse;

export type PostsPartialUpdateData = PostWithAuthor;

export type PostsPartialUpdateError = ErrorResponse;

export interface PostsDeleteData {
  message: string;
}

export type PostsDeleteError = ErrorResponse;

export type CommentsCreateData = Comment;

export type CommentsCreateError = ErrorResponse;

export type CommentsListData = CommentList;

export type CommentsListError = ErrorResponse;

export interface CommentsDeleteData {
  message: string;
}

export type CommentsDeleteError = ErrorResponse;

export type CommentsPartialUpdateData = Comment;

export type CommentsPartialUpdateError = ErrorResponse;

export type LikeCreateData = PostLike;

export type LikeCreateError = ErrorResponse;

export interface LikeDeleteData {
  message: string;
}

export type LikeDeleteError = ErrorResponse;

export type NotificationsListData = NotificationList;

export type NotificationsListError = ErrorResponse;

export interface NotificationsDeleteData {
  count: number;
}

export type NotificationsDeleteError = ErrorResponse;

export interface ReadAllUpdateData {
  count: number;
}

export type ReadAllUpdateError = ErrorResponse;

export type ReadUpdateData = Notification;

export type ReadUpdateError = ErrorResponse;

export interface NotificationsDelete2Data {
  message: string;
}

export type NotificationsDelete2Error = ErrorResponse;
