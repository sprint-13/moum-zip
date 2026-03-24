"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TokenService } from "@/entities/auth/model/token-service";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/shared/lib/cookies";
import { login } from "./use-cases/login";

export type LoginActionState = {
  ok: false;
  error: "INVALID_CREDENTIALS" | "INVALID_TOKEN" | "SERVER_ERROR";
} | null;

export async function loginAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  // 입력 파싱
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // use-case 호출
  const result = await login({ email, password });

  // 실패하면 에러 반환
  if (!result.ok) return result;

  // 성공하면 쿠키 저장
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, result.data.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: TokenService.getExpiresIn(result.data.accessToken) || ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, result.data.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  // 대시보드로 이동
  redirect("/");
}
