"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedApi } from "@/shared/api/auth-client";
import { type UpdateProfileResult, updateProfile } from "./use-cases/update-profile";

export type UpdateProfileActionState = UpdateProfileResult | null;

export async function updateProfileAction(
  _: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  // 서버 액션은 입력 파싱과 후처리만 담당하고, 검증/호출 로직은 use-case에 둡니다.
  const name = (formData.get("name") as string | null) ?? "";
  const image = (formData.get("image") as string | null) ?? undefined;
  const authedApi = await getAuthenticatedApi();
  const result = await updateProfile({ name, image }, { userApi: authedApi.user });

  if (!result.ok) {
    return result;
  }

  // 수정 성공 후 서버 컴포넌트에서 다시 최신 프로필을 받도록 갱신합니다.
  revalidatePath("/mypage");

  return { ok: true };
}
