import type { UpdateUserRequest } from "@moum-zip/api";

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
    console.error("[updateProfile] 에러:", error);

    if (error instanceof Response && error.status === 401) {
      return { ok: false, error: "UNAUTHORIZED" };
    }

    if (error instanceof Error && error.message.includes("401")) {
      return { ok: false, error: "UNAUTHORIZED" };
    }

    return { ok: false, error: "SERVER_ERROR" };
  }
};
