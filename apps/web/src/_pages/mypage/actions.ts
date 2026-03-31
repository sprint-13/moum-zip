"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { spaceQueries } from "@/entities/spaces/queries";
import { getApi, isAuth } from "@/shared/api/server";
import { type UpdateProfileResult, updateProfile } from "./use-cases/update-profile";

export type UpdateProfileActionState = UpdateProfileResult | null;

export async function updateProfileAction(
  _: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  // 서버 액션은 입력 파싱과 후처리만 담당하고, 검증/호출 로직은 use-case에 둡니다.
  const name = (formData.get("name") as string | null) ?? "";
  const image = (formData.get("image") as string | null) ?? undefined;
  const authedApi = await getApi();
  const result = await updateProfile({ name, image }, { userApi: authedApi.user });

  if (!result.ok) {
    return result;
  }

  // 수정 성공 후 서버 컴포넌트에서 다시 최신 프로필을 받도록 갱신합니다.
  revalidatePath("/mypage");

  return { ok: true };
}

export async function getSpaceSlugAction(
  meetingId: number,
): Promise<{ ok: true; slug: string } | { ok: false; message: string }> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }

  // 마이페이지 응답엔 space slug가 없어서 meetingId로 내부 DB를 조회합니다.
  const space = await spaceQueries.findByMeetingId(meetingId);

  if (!space?.slug) {
    return {
      ok: false,
      message: "연결된 스페이스를 찾을 수 없습니다.",
    };
  }

  return {
    ok: true,
    slug: space.slug,
  };
}
