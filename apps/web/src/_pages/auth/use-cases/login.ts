import { TokenService } from "@/entities/auth/model/token-service";
import type { LoginResponse } from "@/entities/auth/model/types";
import { api } from "@/shared/api";

type Deps = {
  authApi?: {
    login: (data: { email: string; password: string }) => Promise<{ data: LoginResponse }>;
  };
};

export type LoginResult =
  | { ok: true; data: LoginResponse }
  | { ok: false; error: "INVALID_CREDENTIALS" | "INVALID_TOKEN" | "SERVER_ERROR" };

export async function loginRemote(
  input: { email: string; password: string },
  { authApi = api.auth }: Deps = {},
): Promise<LoginResult> {
  try {
    // 로그인 요청
    const { data } = await authApi.login(input);

    // 토큰 유효성 검증
    if (!TokenService.isValid(data.accessToken)) {
      return { ok: false, error: "INVALID_TOKEN" };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("[login] 에러:", err);

    // Response 객체로 오는 경우
    if (err instanceof Response && err.status === 401) {
      return { ok: false, error: "INVALID_CREDENTIALS" };
    }

    // Error 객체로 오는 경우
    if (err instanceof Error && err.message.includes("401")) {
      return { ok: false, error: "INVALID_CREDENTIALS" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
}
