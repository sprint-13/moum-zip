export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // 쿠키를 HTTPS에서만 전송 (개발 환경 false, 배포 환경 true)
  sameSite: "lax" as const, // CSRF 공격 방어
  path: "/",
} as const;

// 만료 시간(Swagger 기준)
export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15분
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7일
