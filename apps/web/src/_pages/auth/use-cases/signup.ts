import type { HttpResponse } from "@moum-zip/api";
import type { User } from "@/entities/auth/model/types";
import { api } from "@/shared/api";

type Deps = {
  authApi?: {
    signup: (data: { email: string; password: string; name: string; companyName?: string }) => Promise<{ data: User }>;
  };
};

export type SignupResult = { ok: true; data: User } | { ok: false; error: "EMAIL_ALREADY_EXISTS" | "SERVER_ERROR" };

export async function signup(
  input: { email: string; password: string; name: string },
  { authApi = api.auth }: Deps = {},
): Promise<SignupResult> {
  try {
    const { data } = await authApi.signup(input);
    return { ok: true, data };
  } catch (err) {
    // instanceof Response로 먼저 체크
    // 그 외 에러는 HttpResponse로 캐스팅해서 status 추출
    const status = err instanceof Response ? err.status : (err as HttpResponse<unknown, unknown>)?.status;

    // 이미 사용 중인 이메일
    if (status === 409) return { ok: false, error: "EMAIL_ALREADY_EXISTS" };

    return { ok: false, error: "SERVER_ERROR" };
  }
}
