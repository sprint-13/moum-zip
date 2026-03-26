"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedApi } from "@/shared/api/auth-client";
import { type UpdateProfileResult, updateProfile } from "./use-cases/update-profile";

export type UpdateProfileActionState = UpdateProfileResult | null;

export async function updateProfileAction(
  _: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const name = (formData.get("name") as string | null) ?? "";
  const image = (formData.get("image") as string | null) ?? undefined;
  const authedApi = await getAuthenticatedApi();
  const result = await updateProfile({ name, image }, { userApi: authedApi.user });

  if (!result.ok) {
    return result;
  }

  revalidatePath("/mypage");

  return { ok: true };
}
