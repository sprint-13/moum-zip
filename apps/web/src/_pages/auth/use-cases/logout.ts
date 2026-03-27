import { api } from "@/shared/api";

type Deps = {
  authApi?: {
    logout: (data: { refreshToken: string }) => Promise<unknown>;
  };
};

export type LogoutResult = { ok: true } | { ok: false; error: "SERVER_ERROR" };

export async function logout(
  input: { refreshToken: string },
  { authApi = api.auth }: Deps = {},
): Promise<LogoutResult> {
  try {
    await authApi.logout(input);
    return { ok: true };
  } catch (err) {
    console.error("[logout] 에러:", err);
    return { ok: false, error: "SERVER_ERROR" };
  }
}
