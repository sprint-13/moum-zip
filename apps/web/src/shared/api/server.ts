/**
 * @file shared/api/server.ts
 *
 * Next.js 전용 서버 레이어
 * next/headers, next/navigation 의존성은 이 파일에만 격리
 * 클라이언트 컴포넌트에서 import 금지
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TokenService } from "@/entities/auth/model/token-service";
import { createApiClient } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/shared/lib/cookies";

// ─────────────────────────────────────────────────────────────
// getApiClient
//
// 서버 액션에서 인증이 필요한 API를 호출할 때 사용
// cookies()로 토큰을 읽어 createApiClient에 콜백으로 주입
//
// customFetch가 내부에서 자동으로 처리하는 것:
//   - 요청마다 Authorization 헤더 주입
//   - 401 응답 시 refreshToken으로 갱신 후 재시도 (1회)
//   - 갱신 성공 시 onTokenRefreshed 콜백으로 쿠키 갱신
//   - 갱신 실패 시 onAuthFailed 콜백으로 쿠키 삭제 + 로그인으로 redirect
//
//    서버 컴포넌트에서는 사용 금지 (쿠키 set 불가)
//    서버 컴포넌트에서 인증이 필요한 경우 서버 액션으로 분리할 것
//
// @example
// const client = await getApiClient();
// const data = await client.user.getUser();
// ─────────────────────────────────────────────────────────────

export async function getApi() {
  const cookieStore = await cookies();

  return createApiClient(
    // accessToken 읽기
    () => cookieStore.get(ACCESS_TOKEN_COOKIE)?.value,

    // refreshToken 읽기
    () => cookieStore.get(REFRESH_TOKEN_COOKIE)?.value,

    // 갱신 성공 시 새 토큰을 쿠키에 저장
    ({ accessToken, refreshToken }) => {
      cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
      cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    },

    // 갱신 실패 시 쿠키 삭제 + 로그인으로 redirect
    async () => {
      cookieStore.delete(ACCESS_TOKEN_COOKIE);
      cookieStore.delete(REFRESH_TOKEN_COOKIE);
      redirect(ROUTES.login);
    },
  );
}

// ─────────────────────────────────────────────────────────────
// isAuth
//
// 현재 요청의 accessToken 유효성을 검증하고 userId를 반환
// 인증 상태 확인 용도로 사용
//
// 토큰 갱신 X, 만료된 토큰이면 authenticated: false 반환
// 갱신이 필요한 경우 getApiClient() 사용
//
// @example
// const { authenticated, userId } = await isAuth();
// if (!authenticated) redirect(ROUTES.login);
// ─────────────────────────────────────────────────────────────

export async function isAuth(): Promise<{ authenticated: boolean; userId: number | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token || !TokenService.isValid(token)) {
    return { authenticated: false, userId: null };
  }

  const payload = TokenService.decode(token);
  return { authenticated: true, userId: payload ? Number(payload.sub) : null };
}
