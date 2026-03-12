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
  CreateMeeting,
  GetMeetingsData,
  GetMeetingsError,
  JoinCreateData,
  JoinCreateError,
  JoinDeleteData,
  JoinDeleteError,
  JoinedListData,
  JoinedListError,
  MeetingsCreateData,
  MeetingsCreateError,
  MeetingsDeleteData,
  MeetingsDeleteError,
  MeetingsDetailData,
  MeetingsDetailError,
  MeetingsListData,
  MeetingsPartialUpdateData,
  MeetingsPartialUpdateError,
  ParticipantsListData,
  ParticipantsListError,
  StatusPartialUpdateData,
  StatusPartialUpdateError,
  UpdateMeeting,
  UpdateMeetingStatus,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Meetings<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 현재 사용자가 참여한 모임 목록을 조회합니다.
   *
   * @tags Meetings
   * @name JoinedList
   * @summary 참여한 모임 목록
   * @request GET:/{teamId}/meetings/joined
   * @secure
   */
  joinedList = (
    teamId: string,
    query?: {
      /**
       * 완료된 모임만 조회 (true: 지난 모임, false: 예정된 모임)
       * @example "false"
       */
      completed?: "true" | "false";
      /**
       * 리뷰 작성 여부로 필터링 (true: 작성함, false: 미작성)
       * @example "false"
       */
      reviewed?: "true" | "false";
      /**
       * 정렬 기준: dateTime(모임 일시), registrationEnd(모집 마감일), joinedAt(참가 신청일)
       * @default "dateTime"
       * @example "dateTime"
       */
      sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
      /**
       * 정렬 순서: asc(오름차순), desc(내림차순)
       * @default "asc"
       * @example "asc"
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
    this.request<JoinedListData, JoinedListError>({
      path: `/${teamId}/meetings/joined`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 사용자가 호스트인 모임 목록을 조회합니다.
   *
   * @tags Meetings
   * @name GetMeetings
   * @summary 내가 만든 모임 목록
   * @request GET:/{teamId}/meetings/my
   * @secure
   */
  getMeetings = (
    teamId: string,
    query?: {
      /**
       * 정렬 기준: dateTime(모임 일시), registrationEnd(모집 마감일), participantCount(참가자 수)
       * @default "dateTime"
       * @example "dateTime"
       */
      sortBy?: "dateTime" | "registrationEnd" | "participantCount";
      /**
       * 정렬 순서: asc(오름차순), desc(내림차순)
       * @default "asc"
       * @example "asc"
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
    this.request<GetMeetingsData, GetMeetingsError>({
      path: `/${teamId}/meetings/my`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 목록을 조회합니다. 취소되지 않은 모임만 반환됩니다.
   *
   * @tags Meetings
   * @name MeetingsList
   * @summary 모임 목록
   * @request GET:/{teamId}/meetings
   * @secure
   */
  meetingsList = (
    teamId: string,
    query?: {
      /**
       * 특정 모임 ID로 필터링
       * @min 0
       * @exclusiveMin true
       * @example 1
       */
      id?: number;
      /**
       * 모임 종류로 필터링 (예: 달램핏, 오피스 스트레칭)
       * @example "달램핏"
       */
      type?: string;
      /**
       * 지역으로 필터링 (예: 강남, 건대입구, 홍대입구)
       * @example "건대입구"
       */
      region?: string;
      /**
       * 특정 날짜의 모임만 조회 (YYYY-MM-DD 형식)
       * @format date-time
       * @example "2026-02-10"
       */
      date?: string | null;
      /**
       * 호스트 사용자 ID로 필터링
       * @min 0
       * @exclusiveMin true
       * @example 1
       */
      createdBy?: number;
      /**
       * 정렬 기준: dateTime(모임 일시), registrationEnd(모집 마감일), participantCount(참가자 수)
       * @default "dateTime"
       * @example "dateTime"
       */
      sortBy?: "dateTime" | "registrationEnd" | "participantCount";
      /**
       * 정렬 순서: asc(오름차순), desc(내림차순)
       * @default "asc"
       * @example "asc"
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
    this.request<MeetingsListData, any>({
      path: `/${teamId}/meetings`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 모임을 생성합니다. **비즈니스 규칙:** - 모임 일시(dateTime)는 현재 시각 이후여야 합니다 - 모집 마감일(registrationEnd)은 모임 일시 이전이어야 합니다 - 호스트는 자동으로 첫 번째 참가자로 등록됩니다 - capacity는 최소 1명 이상이어야 합니다
   *
   * @tags Meetings
   * @name MeetingsCreate
   * @summary 모임 생성
   * @request POST:/{teamId}/meetings
   * @secure
   */
  meetingsCreate = (teamId: string, data: CreateMeeting, params: RequestParams = {}) =>
    this.request<MeetingsCreateData, MeetingsCreateError>({
      path: `/${teamId}/meetings`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 모임의 상세 정보를 조회합니다.
   *
   * @tags Meetings
   * @name MeetingsDetail
   * @summary 모임 상세
   * @request GET:/{teamId}/meetings/{meetingId}
   * @secure
   */
  meetingsDetail = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<MeetingsDetailData, MeetingsDetailError>({
      path: `/${teamId}/meetings/${meetingId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 정보를 수정합니다. **비즈니스 규칙:** - 호스트만 수정할 수 있습니다 - 취소된 모임은 수정 불가 - 정원(capacity)을 현재 참가자 수보다 줄일 수 없습니다 - 모임 일시는 현재 시각 이후여야 합니다 - 모집 마감일은 모임 일시 이전이어야 합니다
   *
   * @tags Meetings
   * @name MeetingsPartialUpdate
   * @summary 모임 수정
   * @request PATCH:/{teamId}/meetings/{meetingId}
   * @secure
   */
  meetingsPartialUpdate = (teamId: string, meetingId: number, data: UpdateMeeting, params: RequestParams = {}) =>
    this.request<MeetingsPartialUpdateData, MeetingsPartialUpdateError>({
      path: `/${teamId}/meetings/${meetingId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 모임을 완전히 삭제합니다. 주최자만 가능합니다. 참가자, 리뷰, 찜이 모두 함께 삭제됩니다.
   *
   * @tags Meetings
   * @name MeetingsDelete
   * @summary 모임 삭제
   * @request DELETE:/{teamId}/meetings/{meetingId}
   * @secure
   */
  meetingsDelete = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<MeetingsDeleteData, MeetingsDeleteError>({
      path: `/${teamId}/meetings/${meetingId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임에 참여 신청합니다. **비즈니스 규칙:** - 취소된 모임은 참여 불가 (400 CANCELED) - 모집 마감일이 지나면 참여 불가 (400 REGISTRATION_CLOSED) - 정원 초과 시 참여 불가 (400 CAPACITY_FULL) - 동일 모임 중복 참여 불가 (409 ALREADY_JOINED) - 호스트는 자동 참여되므로 별도 신청 불필요 **알림:** - 참여 인원이 5명에 도달하면 호스트에게 개설 확정 알림 발생
   *
   * @tags Meetings
   * @name JoinCreate
   * @summary 모임 참여
   * @request POST:/{teamId}/meetings/{meetingId}/join
   * @secure
   */
  joinCreate = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<JoinCreateData, JoinCreateError>({
      path: `/${teamId}/meetings/${meetingId}/join`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 참여를 취소합니다. - 호스트는 참여를 취소할 수 없습니다 (모임 취소를 이용해주세요) - 취소된 모임은 참여 취소 불가 - 이미 시작된 모임은 참여 취소 불가
   *
   * @tags Meetings
   * @name JoinDelete
   * @summary 참여 취소
   * @request DELETE:/{teamId}/meetings/{meetingId}/join
   * @secure
   */
  joinDelete = (teamId: string, meetingId: number, params: RequestParams = {}) =>
    this.request<JoinDeleteData, JoinDeleteError>({
      path: `/${teamId}/meetings/${meetingId}/join`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임의 참가자 목록을 조회합니다.
   *
   * @tags Meetings
   * @name ParticipantsList
   * @summary 참가자 목록
   * @request GET:/{teamId}/meetings/{meetingId}/participants
   * @secure
   */
  participantsList = (
    teamId: string,
    meetingId: number,
    query?: {
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
    this.request<ParticipantsListData, ParticipantsListError>({
      path: `/${teamId}/meetings/${meetingId}/participants`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 모임을 확정하거나 취소합니다. 주최자만 가능합니다.
   *
   * @tags Meetings
   * @name StatusPartialUpdate
   * @summary 모임 상태 변경
   * @request PATCH:/{teamId}/meetings/{meetingId}/status
   * @secure
   */
  statusPartialUpdate = (teamId: string, meetingId: number, data: UpdateMeetingStatus, params: RequestParams = {}) =>
    this.request<StatusPartialUpdateData, StatusPartialUpdateError>({
      path: `/${teamId}/meetings/${meetingId}/status`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
