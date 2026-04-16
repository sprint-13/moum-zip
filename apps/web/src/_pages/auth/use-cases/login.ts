import { TokenService } from "@/entities/auth/model/token-service";
import type { LoginResponse } from "@/entities/auth/model/types";
import { api } from "@/shared/api";
import { ERROR_CODES } from "@/shared/lib/error";
import { normalizeApiError } from "@/shared/lib/errors/normalize-api-error";

type Deps = {
  authApi?: {
    login: (data: { email: string; password: string }) => Promise<{ data: LoginResponse }>;
  };
};

export type LoginResult =
  | { ok: true; data: LoginResponse }
  | { ok: false; error: "INVALID_CREDENTIALS" | "INVALID_TOKEN" | "SERVER_ERROR" };

export const loginRemote = async (
  input: { email: string; password: string },
  { authApi = api.auth }: Deps = {},
): Promise<LoginResult> => {
  try {
    // 로그인 요청
    const { data } = await authApi.login(input);

    // 토큰 유효성 검증
    if (!TokenService.isValid(data.accessToken)) {
      return { ok: false, error: "INVALID_TOKEN" };
    }

    return { ok: true, data };
  } catch (err) {
    const normalizedError = await normalizeApiError(err, {
      fallbackMessage: "로그인에 실패했습니다.",
      shouldReport: false,
    });

    if (normalizedError.code === ERROR_CODES.UNAUTHORIZED || normalizedError.code === ERROR_CODES.UNAUTHENTICATED) {
      return { ok: false, error: "INVALID_CREDENTIALS" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
};
