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
  GetUsersData,
  GetUsersError,
  MeMeetingsListData,
  MeMeetingsListError,
  MeReviewsListData,
  MeReviewsListError,
  PatchUsersData,
  PatchUsersError,
  UpdateUserRequest,
  UsersDetailData,
  UsersDetailError,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Users<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 현재 로그인된 사용자의 정보를 조회합니다. Authorization 헤더에 Bearer 토큰이 필요합니다.
   *
   * @tags Users
   * @name GetUsers
   * @summary 내 정보 조회
   * @request GET:/{teamId}/users/me
   * @secure
   */
  getUsers = (teamId: string, params: RequestParams = {}) =>
    this.request<GetUsersData, GetUsersError>({
      path: `/${teamId}/users/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인된 사용자의 정보를 수정합니다. 변경할 필드만 전송하면 됩니다.
   *
   * @tags Users
   * @name PatchUsers
   * @summary 내 정보 수정
   * @request PATCH:/{teamId}/users/me
   * @secure
   */
  patchUsers = (teamId: string, data: UpdateUserRequest, params: RequestParams = {}) =>
    this.request<PatchUsersData, PatchUsersError>({
      path: `/${teamId}/users/me`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 사용자의 공개 프로필을 조회합니다. 인증 없이 접근 가능합니다.
   *
   * @tags Users
   * @name UsersDetail
   * @summary 유저 프로필 조회
   * @request GET:/{teamId}/users/{userId}
   * @secure
   */
  usersDetail = (teamId: string, userId: number, params: RequestParams = {}) =>
    this.request<UsersDetailData, UsersDetailError>({
      path: `/${teamId}/users/${userId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인된 사용자의 모임 목록을 조회합니다. 필터와 정렬 옵션을 지원합니다.
   *
   * @tags Users
   * @name MeMeetingsList
   * @summary 내가 참여한/만든 모임 목록 조회
   * @request GET:/{teamId}/users/me/meetings
   * @secure
   */
  meMeetingsList = (
    teamId: string,
    query?: {
      /** @example "joined" */
      type?: "joined" | "created";
      /** @example "false" */
      completed?: "true" | "false";
      /** @example "false" */
      reviewed?: "true" | "false";
      /** @example "dateTime" */
      sortBy?: "dateTime" | "joinedAt" | "createdAt";
      /**
       * @default "desc"
       * @example "desc"
       */
      sortOrder?: "asc" | "desc";
      /**
       * @min 0
       * @exclusiveMin true
       * @max 50
       * @default 10
       * @example 10
       */
      size?: number;
      /** @example "eyJpZCI6MTB9" */
      cursor?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MeMeetingsListData, MeMeetingsListError>({
      path: `/${teamId}/users/me/meetings`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인된 사용자가 작성한 리뷰 목록을 조회합니다. 정렬 옵션을 지원합니다.
   *
   * @tags Users
   * @name MeReviewsList
   * @summary 내가 작성한 리뷰 목록 조회
   * @request GET:/{teamId}/users/me/reviews
   * @secure
   */
  meReviewsList = (
    teamId: string,
    query?: {
      /**
       * @default "createdAt"
       * @example "createdAt"
       */
      sortBy?: "createdAt" | "score";
      /**
       * @default "desc"
       * @example "desc"
       */
      sortOrder?: "asc" | "desc";
      /**
       * @min 0
       * @exclusiveMin true
       * @max 50
       * @default 10
       * @example 10
       */
      size?: number;
      /** @example "eyJpZCI6MTB9" */
      cursor?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MeReviewsListData, MeReviewsListError>({
      path: `/${teamId}/users/me/reviews`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
