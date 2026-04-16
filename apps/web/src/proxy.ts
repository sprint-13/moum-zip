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
import { ApiError, ERROR_CODES } from "@/shared/lib/error";
import { reportError } from "@/shared/lib/errors/report-error";

// 비로그인 유저도 접근 가능한 공개 경로
const PUBLIC_PATHS = ["/", "/login", "/signup", "/search", "/oauth", "/moim-detail"];

// 미들웨어 실행 건너뛰는 경로
const EXCLUDED_PATHS = ["/_next", "/api", "/fonts", "/favicon"];

function isExcluded(pathname: string) {
  return EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// 경로 정확히 매칭
function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAuthPage(pathname: string) {
  return (
    pathname === "/login" || pathname === "/signup" || pathname.startsWith("/login/") || pathname.startsWith("/signup/")
  );
}

// 토큰 갱신
async function refreshTokens(refreshToken: string) {
  try {
    const res = await fetch(`${baseUrl}/${teamId}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    // 401 정상 플로우 (토큰 만료) - Sentry 전송 안 함
    if (res.status === 401) return null;

    // 5xx(서버 문제) - Sentry로 전송
    if (!res.ok) {
      if (res.status >= 500) {
        await reportError(
          new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR, {
            message: `토큰 갱신 서버 에러: ${res.status}`,
            status: res.status,
          }),
          {
            tags: { scope: "auth-refresh", runtime: "proxy" },
          },
        );
      }
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = await res.json();

    if (typeof accessToken !== "string" || typeof newRefreshToken !== "string") return null;

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    // 네트워크 단절 - Sentry로 전송
    await reportError(error, {
      fallbackMessage: "토큰 갱신 중 네트워크 오류가 발생했습니다.",
      tags: { scope: "auth-refresh", runtime: "proxy" },
    });
    return null;
  }
}

// request.cookies.set: 현재 요청에서 서버 컴포넌트가 새 토큰을 읽을 수 있도록
// res.cookies.set: 브라우저 쿠키 갱신 (다음 요청부터 새 토큰 사용)
function setTokenCookies(request: NextRequest, tokens: { accessToken: string; refreshToken: string }) {
  request.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);

  const res = NextResponse.next({ request });

  res.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return res;
}

// 쿠키 삭제 (로그인 세션 만료)
function clearTokenCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcluded(pathname)) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // 액세스 토큰이 유효하면 통과
  // 로그인 상태에서 /login, /signup 접근 시 홈으로 redirect
  if (accessToken && TokenService.isValid(accessToken)) {
    if (isAuthPage(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 액세스 토큰이 없거나 만료됐지만 리프레시 토큰이 있으면 갱신 시도
  if (refreshToken) {
    const tokens = await refreshTokens(refreshToken);

    if (tokens) {
      // 갱신 성공 시 /login, /signup이면 홈으로 redirect (새 토큰은 redirect 응답에 저장)
      // 그 외엔 새 토큰 저장 후 요청 페이지로 통과
      if (isAuthPage(pathname)) {
        const redirectRes = NextResponse.redirect(new URL("/", request.url));
        redirectRes.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: ACCESS_TOKEN_MAX_AGE,
        });
        redirectRes.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        });
        return redirectRes;
      }
      return setTokenCookies(request, tokens);
    }
    // 갱신 실패 시 토큰 삭제 후 공개 경로면 통과 / 보호 경로면 /login redirect
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)"],
};
