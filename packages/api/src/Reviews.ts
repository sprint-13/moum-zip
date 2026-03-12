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
  CategoriesStatisticsListData,
  CreateReviewByMeeting,
  ReviewsCreateData,
  ReviewsCreateError,
  ReviewsDeleteData,
  ReviewsDeleteError,
  ReviewsList2Data,
  ReviewsListData,
  ReviewsPartialUpdateData,
  ReviewsPartialUpdateError,
  StatisticsListData,
  UpdateReview,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Reviews<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 리뷰 목록을 조회합니다.
   *
   * @tags Reviews
   * @name ReviewsList
   * @summary 리뷰 목록
   * @request GET:/{teamId}/reviews
   * @secure
   */
  reviewsList = (
    teamId: string,
    query?: {
      /**
       * 특정 모임의 리뷰만 조회
       * @min 0
       * @exclusiveMin true
       */
      meetingId?: number;
      /**
       * 특정 사용자의 리뷰만 조회
       * @min 0
       * @exclusiveMin true
       */
      userId?: number;
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
       * 모집 마감일로 필터링 (YYYY-MM-DD)
       * @format date-time
       */
      registrationEnd?: string | null;
      /**
       * 정렬 기준
       * @default "createdAt"
       */
      sortBy?: "createdAt" | "score" | "participantCount";
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
    this.request<ReviewsListData, any>({
      path: `/${teamId}/reviews`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 팀 전체 리뷰 통계를 조회합니다.
   *
   * @tags Reviews
   * @name StatisticsList
   * @summary 리뷰 전체 통계
   * @request GET:/{teamId}/reviews/statistics
   * @secure
   */
  statisticsList = (teamId: string, params: RequestParams = {}) =>
    this.request<StatisticsListData, any>({
      path: `/${teamId}/reviews/statistics`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 종류별 리뷰 통계를 조회합니다.
   *
   * @tags Reviews
   * @name CategoriesStatisticsList
   * @summary 카테고리별 리뷰 통계
   * @request GET:/{teamId}/reviews/categories/statistics
   * @secure
   */
  categoriesStatisticsList = (teamId: string, params: RequestParams = {}) =>
    this.request<CategoriesStatisticsListData, any>({
      path: `/${teamId}/reviews/categories/statistics`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 리뷰를 수정합니다. 본인의 리뷰만 수정할 수 있습니다.
   *
   * @tags Reviews
   * @name ReviewsPartialUpdate
   * @summary 리뷰 수정
   * @request PATCH:/{teamId}/reviews/{reviewId}
   * @secure
   */
  reviewsPartialUpdate = (teamId: string, reviewId: number, data: UpdateReview, params: RequestParams = {}) =>
    this.request<ReviewsPartialUpdateData, ReviewsPartialUpdateError>({
      path: `/${teamId}/reviews/${reviewId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 리뷰를 삭제합니다. 본인의 리뷰만 삭제할 수 있습니다.
   *
   * @tags Reviews
   * @name ReviewsDelete
   * @summary 리뷰 삭제
   * @request DELETE:/{teamId}/reviews/{reviewId}
   * @secure
   */
  reviewsDelete = (teamId: string, reviewId: number, params: RequestParams = {}) =>
    this.request<ReviewsDeleteData, ReviewsDeleteError>({
      path: `/${teamId}/reviews/${reviewId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 모임에 리뷰를 작성합니다.
   *
   * @tags Reviews
   * @name ReviewsCreate
   * @summary 리뷰 작성 (중첩)
   * @request POST:/{teamId}/meetings/{meetingId}/reviews
   * @secure
   */
  reviewsCreate = (teamId: string, meetingId: number, data: CreateReviewByMeeting, params: RequestParams = {}) =>
    this.request<ReviewsCreateData, ReviewsCreateError>({
      path: `/${teamId}/meetings/${meetingId}/reviews`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 모임의 리뷰 목록을 조회합니다.
   *
   * @tags Reviews
   * @name ReviewsList2
   * @summary 특정 모임 리뷰 목록 (중첩)
   * @request GET:/{teamId}/meetings/{meetingId}/reviews
   * @originalName reviewsList
   * @duplicate
   * @secure
   */
  reviewsList2 = (
    teamId: string,
    meetingId: number,
    query?: {
      /**
       * 특정 사용자의 리뷰만 조회
       * @min 0
       * @exclusiveMin true
       */
      userId?: number;
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
       * 모집 마감일로 필터링 (YYYY-MM-DD)
       * @format date-time
       */
      registrationEnd?: string | null;
      /**
       * 정렬 기준
       * @default "createdAt"
       */
      sortBy?: "createdAt" | "score" | "participantCount";
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
    this.request<ReviewsList2Data, any>({
      path: `/${teamId}/meetings/${meetingId}/reviews`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
