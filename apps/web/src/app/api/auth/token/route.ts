import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/shared/lib/cookies";

// 소셜 로그인 콜백에서 받은 토큰을 httpOnly 쿠키에 저장
// 클라이언트에서 직접 쿠키를 set할 수 없음 → Route Handler로 처리
export async function POST(request: Request) {
  let accessToken: unknown;
  let refreshToken: unknown;

  try {
    const body = await request.json();
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;
  } catch {
    // JSON 파싱 실패 시 (malformed body) 500 대신 400 반환
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  // 토큰 존재 여부 및 string 타입 검증
  if (!accessToken || !refreshToken || typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return NextResponse.json({ message: "토큰이 없습니다." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  // httpOnly 쿠키로 저장 → XSS 방어
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return response;
}
