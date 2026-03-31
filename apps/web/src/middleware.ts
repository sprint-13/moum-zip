import { type NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/entities/auth/model/token-service";
import { API_BASE_URL as baseUrl, TEAM_ID as teamId } from "@/shared/config/env";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/shared/lib/cookies";

// 비로그인 유저도 접근 가능한 공개 경로
const PUBLIC_PATHS = ["/login", "/signup", "/search", "/oauth", "/moim-detail"];

// 미들웨어 실행 건너뛰는 경로
const EXCLUDED_PATHS = ["/_next", "/api", "/fonts", "/favicon"];

function isExcluded(pathname: string) {
  return EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

// 토큰 갱신
async function refreshTokens(refreshToken: string) {
  try {
    const res = await fetch(`${baseUrl}/${teamId}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const { accessToken, refreshToken: newRefreshToken } = await res.json();
    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    return null;
  }
}

// 쿠키 set
function setTokenCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return response;
}

// 쿠키 삭제 (로그인 세션 만료)
function clearTokenCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcluded(pathname)) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // 액세스 토큰 검증
  if (accessToken && TokenService.isValid(accessToken)) {
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 액세스 토큰이 없거나 만료됐지만 리프레시 토큰이 있으면 갱신 시도
  if (refreshToken) {
    const tokens = await refreshTokens(refreshToken);

    if (tokens) {
      // 갱신 성공 → 새 토큰 쿠키 저장 후 통과
      return setTokenCookies(NextResponse.next(), tokens);
    }

    // 갱신 실패 → 토큰 삭제 후 공개 경로면 통과 / 보호 경로면 /login redirect
    if (isPublic(pathname)) {
      return clearTokenCookies(NextResponse.next());
    }
    return clearTokenCookies(NextResponse.redirect(new URL("/login", request.url)));
  }

  // 토큰이 아예 없으면 보호 경로 접근 시 /login redirect
  if (!isPublic(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
