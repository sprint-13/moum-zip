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
  NotificationsDelete2Data,
  NotificationsDelete2Error,
  NotificationsDeleteData,
  NotificationsDeleteError,
  NotificationsListData,
  NotificationsListError,
  ReadAllUpdateData,
  ReadAllUpdateError,
  ReadUpdateData,
  ReadUpdateError,
} from "./data-contracts";
import { HttpClient, type RequestParams } from "./http-client";

export class Notifications<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 현재 사용자의 알림 목록을 조회합니다. - 알림 종류: 개설 확정(MEETING_CONFIRMED), 모임 취소(MEETING_CANCELED), 댓글(COMMENT) - isRead 파라미터로 읽음/미읽음 필터링 가능
   *
   * @tags Notifications
   * @name NotificationsList
   * @summary 알림 목록
   * @request GET:/{teamId}/notifications
   * @secure
   */
  notificationsList = (
    teamId: string,
    query?: {
      /** 읽음 여부로 필터링 */
      isRead?: "true" | "false";
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
    this.request<NotificationsListData, NotificationsListError>({
      path: `/${teamId}/notifications`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 사용자의 모든 알림을 삭제합니다.
   *
   * @tags Notifications
   * @name NotificationsDelete
   * @summary 전체 알림 삭제
   * @request DELETE:/{teamId}/notifications
   * @secure
   */
  notificationsDelete = (teamId: string, params: RequestParams = {}) =>
    this.request<NotificationsDeleteData, NotificationsDeleteError>({
      path: `/${teamId}/notifications`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모든 읽지 않은 알림을 읽음으로 표시합니다.
   *
   * @tags Notifications
   * @name ReadAllUpdate
   * @summary 모든 알림 읽음 처리
   * @request PUT:/{teamId}/notifications/read-all
   * @secure
   */
  readAllUpdate = (teamId: string, params: RequestParams = {}) =>
    this.request<ReadAllUpdateData, ReadAllUpdateError>({
      path: `/${teamId}/notifications/read-all`,
      method: "PUT",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 알림을 읽음으로 표시합니다.
   *
   * @tags Notifications
   * @name ReadUpdate
   * @summary 알림 읽음 처리
   * @request PUT:/{teamId}/notifications/{notificationId}/read
   * @secure
   */
  readUpdate = (teamId: string, notificationId: number, params: RequestParams = {}) =>
    this.request<ReadUpdateData, ReadUpdateError>({
      path: `/${teamId}/notifications/${notificationId}/read`,
      method: "PUT",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 알림을 삭제합니다.
   *
   * @tags Notifications
   * @name NotificationsDelete2
   * @summary 알림 삭제
   * @request DELETE:/{teamId}/notifications/{notificationId}
   * @originalName notificationsDelete
   * @duplicate
   * @secure
   */
  notificationsDelete2 = (teamId: string, notificationId: number, params: RequestParams = {}) =>
    this.request<NotificationsDelete2Data, NotificationsDelete2Error>({
      path: `/${teamId}/notifications/${notificationId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
