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
  CountListData,
  CountListError,
  FavoritesCreateData,
  FavoritesCreateError,
  FavoritesDeleteData,
  FavoritesDeleteError,
  FavoritesListData,
  FavoritesListError,
} from "./data-contracts";
import { HttpClient, type RequestParams } from "./http-client";

export class Favorites<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 찜한 모임 목록을 조회합니다.
   *
   * @tags Favorites
   * @name FavoritesList
   * @summary 찜 목록
   * @request GET:/{teamId}/favorites
   * @secure
   */
  favoritesList = (
    teamId: string,
    query?: {
      /** 모임 종류로 필터링 */
      type?: string;
      /** 지역으로 필터링 */
      region?: string;
      /**
       * 모임 날짜로 필터링 (YYYY-MM-DD)
       * @format date-time
       */
      date?: string | null;
      /**
       * 정렬 기준
       * @default "createdAt"
       */
      sortBy?: "createdAt" | "dateTime" | "registrationEnd" | "participantCount";
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
    this.request<FavoritesListData, FavoritesListError>({
      path: `/${teamId}/favorites`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 사용자의 찜 개수를 조회합니다.
   *
   * @tags Favorites
   * @name CountList
   * @summary 찜 개수
   * @request GET:/{teamId}/favorites/count
   * @secure
   */
  countList = (teamId: string, params: RequestParams = {}) =>
    this.request<CountListData, CountListError>({
      path: `/${teamId}/favorites/count`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 모임을 찜합니다.
   *
   * @tags Favorites
   * @name FavoritesCreate
   * @summary 찜 추가 (중첩)
   * @request POST:/{teamId}/meetings/{meetingId}/favorites
   * @secure
   */
  favoritesCreate = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<FavoritesCreateData, FavoritesCreateError>({
      path: `/${teamId}/meetings/${meetingId}/favorites`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 모임의 찜을 해제합니다.
   *
   * @tags Favorites
   * @name FavoritesDelete
   * @summary 찜 해제 (중첩)
   * @request DELETE:/{teamId}/meetings/{meetingId}/favorites
   * @secure
   */
  favoritesDelete = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<FavoritesDeleteData, FavoritesDeleteError>({
      path: `/${teamId}/meetings/${meetingId}/favorites`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
