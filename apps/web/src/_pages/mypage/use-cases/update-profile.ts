import type { UpdateUserRequest } from "@moum-zip/api";
import { ERROR_CODES } from "@/shared/lib/error";
import { normalizeApiError } from "@/shared/lib/errors/normalize-api-error";

interface Deps {
  userApi: {
    patchUser: (data: UpdateUserRequest) => Promise<unknown>;
  };
}

export type UpdateProfileResult =
  | { ok: true }
  | { ok: false; error: "EMPTY_NAME" | "NAME_TOO_LONG" | "UNAUTHORIZED" | "SERVER_ERROR" };

export const updateProfile = async (
  input: { name: string; image?: string },
  { userApi }: Deps,
): Promise<UpdateProfileResult> => {
  const name = input.name.trim();
  const image = input.image?.trim();

  if (!name) {
    return { ok: false, error: "EMPTY_NAME" };
  }

  if (name.length > 20) {
    return { ok: false, error: "NAME_TOO_LONG" };
  }

  try {
    await userApi.patchUser({
      name,
      ...(image ? { image } : {}),
    });

    return { ok: true };
  } catch (error) {
    const normalizedError = await normalizeApiError(error, {
      fallbackMessage: "프로필 수정 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
      shouldReport: false,
    });

    if (normalizedError.code === ERROR_CODES.UNAUTHORIZED || normalizedError.code === ERROR_CODES.UNAUTHENTICATED) {
      return { ok: false, error: "UNAUTHORIZED" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
};
