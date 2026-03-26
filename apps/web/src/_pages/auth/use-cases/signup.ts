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
    console.error("[signup] 에러:", err);

    if (err instanceof Response && err.status === 409) {
      return { ok: false, error: "EMAIL_ALREADY_EXISTS" };
    }

    if (err instanceof Error && err.message.includes("409")) {
      return { ok: false, error: "EMAIL_ALREADY_EXISTS" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
}
