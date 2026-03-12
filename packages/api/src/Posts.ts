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

import type {
  CommentsCreateData,
  CommentsCreateError,
  CommentsDeleteData,
  CommentsDeleteError,
  CommentsListData,
  CommentsListError,
  CommentsPartialUpdateData,
  CommentsPartialUpdateError,
  CreateComment,
  CreatePost,
  LikeCreateData,
  LikeCreateError,
  LikeDeleteData,
  LikeDeleteError,
  PostsCreateData,
  PostsCreateError,
  PostsDeleteData,
  PostsDeleteError,
  PostsDetailData,
  PostsDetailError,
  PostsListData,
  PostsPartialUpdateData,
  PostsPartialUpdateError,
  UpdateComment,
  UpdatePost,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Posts<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 게시글 목록을 조회합니다. **조회 타입:** - type=all: 전체 게시글 (기본값, 최신순) - type=best: 베스트 게시글 (최근 30일 내 작성, likeCount 높은 순) **페이지네이션:** - offset: 건너뛸 항목 수 (기본 0) - limit: 조회할 최대 항목 수 (기본 10, 최대 100)
   *
   * @tags Posts
   * @name PostsList
   * @summary 게시글 목록
   * @request GET:/{teamId}/posts
   * @secure
   */
  postsList = (
    teamId: string,
    query?: {
      /**
       * 게시글 타입 (all: 전체, best: 베스트)
       * @default "all"
       */
      type?: "all" | "best";
      /** 제목/내용 검색 */
      keyword?: string;
      /**
       * 정렬 기준
       * @default "createdAt"
       */
      sortBy?: "createdAt" | "viewCount" | "likeCount";
      /**
       * 정렬 순서
       * @default "desc"
       */
      sortOrder?: "asc" | "desc";
      /**
       * 다음 페이지를 위한 커서
       * @example "eyJpZCI6MTB9"
       */
      cursor?: string;
      /**
       * 페이지 크기 (1-100)
       * @min 1
       * @max 100
       * @default 10
       * @example 10
       */
      size?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<PostsListData, any>({
      path: `/${teamId}/posts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 게시글을 작성합니다. **비즈니스 규칙:** - 제목(title)은 필수이며 최소 1자 이상 - 내용(content)은 필수이며 최소 1자 이상 - 이미지(image)는 선택 사항 - 작성 시 likeCount와 viewCount는 0으로 초기화
   *
   * @tags Posts
   * @name PostsCreate
   * @summary 게시글 작성
   * @request POST:/{teamId}/posts
   * @secure
   */
  postsCreate = (teamId: string, data: CreatePost, params: RequestParams = {}) =>
    this.request<PostsCreateData, PostsCreateError>({
      path: `/${teamId}/posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글 상세 정보를 조회합니다. 조회 시 조회수가 증가합니다.
   *
   * @tags Posts
   * @name PostsDetail
   * @summary 게시글 상세
   * @request GET:/{teamId}/posts/{postId}
   * @secure
   */
  postsDetail = (teamId: string, postId: number, params: RequestParams = {}) =>
    this.request<PostsDetailData, PostsDetailError>({
      path: `/${teamId}/posts/${postId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글을 수정합니다. **비즈니스 규칙:** - 작성자만 수정할 수 있습니다 - 제목, 내용, 이미지를 개별적으로 수정 가능 - likeCount와 viewCount는 수정되지 않습니다
   *
   * @tags Posts
   * @name PostsPartialUpdate
   * @summary 게시글 수정
   * @request PATCH:/{teamId}/posts/{postId}
   * @secure
   */
  postsPartialUpdate = (teamId: string, postId: number, data: UpdatePost, params: RequestParams = {}) =>
    this.request<PostsPartialUpdateData, PostsPartialUpdateError>({
      path: `/${teamId}/posts/${postId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글을 삭제합니다. 작성자만 삭제할 수 있습니다.
   *
   * @tags Posts
   * @name PostsDelete
   * @summary 게시글 삭제
   * @request DELETE:/{teamId}/posts/{postId}
   * @secure
   */
  postsDelete = (teamId: string, postId: number, params: RequestParams = {}) =>
    this.request<PostsDeleteData, PostsDeleteError>({
      path: `/${teamId}/posts/${postId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글에 댓글을 작성합니다. - 게시글 작성자에게 알림이 발생합니다 (본인 댓글 제외)
   *
   * @tags Posts
   * @name CommentsCreate
   * @summary 댓글 작성
   * @request POST:/{teamId}/posts/{postId}/comments
   * @secure
   */
  commentsCreate = (teamId: string, postId: number, data: CreateComment, params: RequestParams = {}) =>
    this.request<CommentsCreateData, CommentsCreateError>({
      path: `/${teamId}/posts/${postId}/comments`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글의 댓글 목록을 조회합니다.
   *
   * @tags Posts
   * @name CommentsList
   * @summary 댓글 목록
   * @request GET:/{teamId}/posts/{postId}/comments
   * @secure
   */
  commentsList = (
    teamId: string,
    postId: number,
    query?: {
      /** @default "createdAt" */
      sortBy?: "createdAt";
      /** @default "asc" */
      sortOrder?: "asc" | "desc";
      /**
       * 다음 페이지를 위한 커서
       * @example "eyJpZCI6MTB9"
       */
      cursor?: string;
      /**
       * 페이지 크기 (1-100)
       * @min 1
       * @max 100
       * @default 10
       * @example 10
       */
      size?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<CommentsListData, CommentsListError>({
      path: `/${teamId}/posts/${postId}/comments`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 댓글을 삭제합니다. 작성자만 삭제할 수 있습니다.
   *
   * @tags Posts
   * @name CommentsDelete
   * @summary 댓글 삭제
   * @request DELETE:/{teamId}/posts/{postId}/comments/{commentId}
   * @secure
   */
  commentsDelete = (teamId: string, postId: number, commentId: number, params: RequestParams = {}) =>
    this.request<CommentsDeleteData, CommentsDeleteError>({
      path: `/${teamId}/posts/${postId}/comments/${commentId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 댓글을 수정합니다. 작성자만 수정할 수 있습니다.
   *
   * @tags Posts
   * @name CommentsPartialUpdate
   * @summary 댓글 수정
   * @request PATCH:/{teamId}/posts/{postId}/comments/{commentId}
   * @secure
   */
  commentsPartialUpdate = (
    teamId: string,
    postId: number,
    commentId: number,
    data: UpdateComment,
    params: RequestParams = {},
  ) =>
    this.request<CommentsPartialUpdateData, CommentsPartialUpdateError>({
      path: `/${teamId}/posts/${postId}/comments/${commentId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글에 좋아요를 추가합니다.
   *
   * @tags Posts
   * @name LikeCreate
   * @summary 좋아요 추가
   * @request POST:/{teamId}/posts/{postId}/like
   * @secure
   */
  likeCreate = (teamId: string, postId: number, params: RequestParams = {}) =>
    this.request<LikeCreateData, LikeCreateError>({
      path: `/${teamId}/posts/${postId}/like`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 게시글의 좋아요를 취소합니다.
   *
   * @tags Posts
   * @name LikeDelete
   * @summary 좋아요 취소
   * @request DELETE:/{teamId}/posts/{postId}/like
   * @secure
   */
  likeDelete = (teamId: string, postId: number, params: RequestParams = {}) =>
    this.request<LikeDeleteData, LikeDeleteError>({
      path: `/${teamId}/posts/${postId}/like`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
