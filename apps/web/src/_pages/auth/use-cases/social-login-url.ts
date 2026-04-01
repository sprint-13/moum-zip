import { API_BASE_URL, TEAM_ID } from "@/shared/config/env";

/**
 * 구글 소셜 로그인 시작 URL 반환
 * 브라우저가 이 URL로 이동하면 백엔드가 구글 로그인 페이지로 302 리다이렉트
 * 구글 인증 완료 후 /oauth/callback?accessToken=...&refreshToken=... 으로 복귀
 */
export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/${TEAM_ID}/auth/google`;
}

/**
 * 카카오 소셜 로그인 시작 URL 반환
 * 브라우저가 이 URL로 이동하면 백엔드가 카카오 로그인 페이지로 302 리다이렉트
 * 카카오 인증 완료 후 /oauth/callback?accessToken=...&refreshToken=... 으로 복귀
 */
export function getKakaoLoginUrl(): string {
  return `${API_BASE_URL}/${TEAM_ID}/auth/kakao`;
}
