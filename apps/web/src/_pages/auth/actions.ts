"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TokenService } from "@/entities/auth/model/token-service";
import { ROUTES } from "@/shared/config/routes";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/shared/lib/cookies";
import { login } from "./use-cases/login";
import { signup } from "./use-cases/signup";

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

  // isValid()에서 이미 만료 토큰을 걸러내지만
  // 0이 falsy라 || 쓰면 만료된 토큰도 15분 쿠키로 저장될 수 있어서
  const expiresIn = TokenService.getExpiresIn(result.data.accessToken);
  cookieStore.set(ACCESS_TOKEN_COOKIE, result.data.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: expiresIn > 0 ? expiresIn : ACCESS_TOKEN_MAX_AGE, // > 0으로 명시적으로 한 번 더 체크
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, result.data.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  // 대시보드로 이동
  redirect(ROUTES.home);
}

export type SignupActionState = {
  ok: false;
  error: "EMAIL_ALREADY_EXISTS" | "SERVER_ERROR";
} | null;

export async function signupAction(_: SignupActionState, formData: FormData): Promise<SignupActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signup({ name, email, password });

  if (!result.ok) return result;

  // 로그인 페이지로 이동
  redirect(ROUTES.login);
}
