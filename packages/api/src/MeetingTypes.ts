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
  CreateMeetingType,
  MeetingTypesCreateData,
  MeetingTypesCreateError,
  MeetingTypesDeleteData,
  MeetingTypesDeleteError,
  MeetingTypesListData,
  MeetingTypesPartialUpdateData,
  MeetingTypesPartialUpdateError,
  UpdateMeetingType,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class MeetingTypes<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 팀의 모임 종류 목록을 조회합니다.
   *
   * @tags MeetingTypes
   * @name MeetingTypesList
   * @summary 모임 종류 목록
   * @request GET:/{teamId}/meeting-types
   * @secure
   */
  meetingTypesList = (teamId: string, params: RequestParams = {}) =>
    this.request<MeetingTypesListData, any>({
      path: `/${teamId}/meeting-types`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 모임 종류를 생성합니다. 팀 내에서 이름은 고유해야 합니다.
   *
   * @tags MeetingTypes
   * @name MeetingTypesCreate
   * @summary 모임 종류 생성
   * @request POST:/{teamId}/meeting-types
   * @secure
   */
  meetingTypesCreate = (teamId: string, data: CreateMeetingType, params: RequestParams = {}) =>
    this.request<MeetingTypesCreateData, MeetingTypesCreateError>({
      path: `/${teamId}/meeting-types`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 종류 정보를 수정합니다.
   *
   * @tags MeetingTypes
   * @name MeetingTypesPartialUpdate
   * @summary 모임 종류 수정
   * @request PATCH:/{teamId}/meeting-types/{typeId}
   * @secure
   */
  meetingTypesPartialUpdate = (teamId: string, typeId: number, data: UpdateMeetingType, params: RequestParams = {}) =>
    this.request<MeetingTypesPartialUpdateData, MeetingTypesPartialUpdateError>({
      path: `/${teamId}/meeting-types/${typeId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 모임 종류를 삭제합니다.
   *
   * @tags MeetingTypes
   * @name MeetingTypesDelete
   * @summary 모임 종류 삭제
   * @request DELETE:/{teamId}/meeting-types/{typeId}
   * @secure
   */
  meetingTypesDelete = (teamId: string, typeId: number, params: RequestParams = {}) =>
    this.request<MeetingTypesDeleteData, MeetingTypesDeleteError>({
      path: `/${teamId}/meeting-types/${typeId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
