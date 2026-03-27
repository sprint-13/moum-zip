import { TokenService } from "@/entities/auth/model/token-service";
import type { TokenResponse } from "@/entities/auth/model/types";
import { api } from "@/shared/api";

type Deps = {
  authApi?: {
    refresh: (data: { refreshToken: string }) => Promise<{ data: TokenResponse }>;
  };
};

export type RefreshResult = { ok: true; data: TokenResponse } | { ok: false; error: "INVALID_TOKEN" | "SERVER_ERROR" };

export async function refresh(
  input: { refreshToken: string },
  { authApi = api.auth }: Deps = {},
): Promise<RefreshResult> {
  try {
    const { data } = await authApi.refresh(input);

    // 새로 받은 accessToken 유효성 검증
    if (!TokenService.isValid(data.accessToken)) {
      return { ok: false, error: "INVALID_TOKEN" };
    }

    return { ok: true, data };
  } catch (err) {
    if (err instanceof Response && err.status === 401) {
      return { ok: false, error: "INVALID_TOKEN" };
    }

    if (err instanceof Error && err.message.includes("401")) {
      return { ok: false, error: "INVALID_TOKEN" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
}
