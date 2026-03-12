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
  GoogleCallbackListError,
  KakaoCallbackListError,
  LoginCreateData,
  LoginCreateError,
  LoginRequest,
  LogoutCreateData,
  LogoutCreateError,
  RefreshCreateData,
  RefreshCreateError,
  RefreshRequest,
  SignupCreateData,
  SignupCreateError,
  SignupRequest,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 새로운 사용자를 등록합니다. 이메일은 팀 내에서 고유해야 합니다.
   *
   * @tags Auth
   * @name SignupCreate
   * @summary 회원가입
   * @request POST:/{teamId}/auth/signup
   * @secure
   */
  signupCreate = (teamId: string, data: SignupRequest, params: RequestParams = {}) =>
    this.request<SignupCreateData, SignupCreateError>({
      path: `/${teamId}/auth/signup`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 이메일과 비밀번호로 로그인합니다. 성공 시 accessToken(15분)과 refreshToken(7일)을 발급합니다.
   *
   * @tags Auth
   * @name LoginCreate
   * @summary 로그인
   * @request POST:/{teamId}/auth/login
   * @secure
   */
  loginCreate = (teamId: string, data: LoginRequest, params: RequestParams = {}) =>
    this.request<LoginCreateData, LoginCreateError>({
      path: `/${teamId}/auth/login`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인된 세션을 종료합니다. 특정 리프레시 토큰만 무효화됩니다.
   *
   * @tags Auth
   * @name LogoutCreate
   * @summary 로그아웃
   * @request POST:/{teamId}/auth/logout
   * @secure
   */
  logoutCreate = (teamId: string, data: RefreshRequest, params: RequestParams = {}) =>
    this.request<LogoutCreateData, LogoutCreateError>({
      path: `/${teamId}/auth/logout`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 리프레시 토큰으로 새로운 accessToken과 refreshToken을 발급받습니다. 기존 리프레시 토큰은 무효화됩니다 (토큰 로테이션).
   *
   * @tags Auth
   * @name RefreshCreate
   * @summary 토큰 갱신
   * @request POST:/{teamId}/auth/refresh
   * @secure
   */
  refreshCreate = (teamId: string, data: RefreshRequest, params: RequestParams = {}) =>
    this.request<RefreshCreateData, RefreshCreateError>({
      path: `/${teamId}/auth/refresh`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 구글 소셜 로그인을 시작합니다. 구글 로그인 페이지로 리다이렉트됩니다.
   *
   * @tags Auth
   * @name GoogleList
   * @summary 구글 OAuth 시작
   * @request GET:/{teamId}/auth/google
   * @secure
   */
  googleList = (teamId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/${teamId}/auth/google`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 카카오 소셜 로그인을 시작합니다. 카카오 로그인 페이지로 리다이렉트됩니다.
   *
   * @tags Auth
   * @name KakaoList
   * @summary 카카오 OAuth 시작
   * @request GET:/{teamId}/auth/kakao
   * @secure
   */
  kakaoList = (teamId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/${teamId}/auth/kakao`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 구글 로그인 완료 후 호출되는 콜백 URL입니다. 프론트엔드로 토큰과 함께 리다이렉트됩니다.
   *
   * @tags Auth
   * @name GoogleCallbackList
   * @summary 구글 OAuth 콜백
   * @request GET:/auth/google/callback
   * @secure
   */
  googleCallbackList = (
    query: {
      /** 구글에서 발급한 인증 코드 */
      code: string;
      /** 요청 시 전달한 teamId */
      state: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, GoogleCallbackListError>({
      path: `/auth/google/callback`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * @description 카카오 로그인 완료 후 호출되는 콜백 URL입니다. 프론트엔드로 토큰과 함께 리다이렉트됩니다.
   *
   * @tags Auth
   * @name KakaoCallbackList
   * @summary 카카오 OAuth 콜백
   * @request GET:/auth/kakao/callback
   * @secure
   */
  kakaoCallbackList = (
    query: {
      /** 카카오에서 발급한 인증 코드 */
      code: string;
      /** 요청 시 전달한 teamId */
      state: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, KakaoCallbackListError>({
      path: `/auth/kakao/callback`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
}
