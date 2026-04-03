"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { updateMoim } from "@/_pages/moim-edit/use-cases/moim-update";
import { parseMoimFormData } from "@/features/moim-create/model/parse-moim-form-data";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { isAuth } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";

export type UpdateMoimActionState = {
  ok: false;
  error: string;
} | null;

export async function updateMoimAction(_: UpdateMoimActionState, formData: FormData): Promise<UpdateMoimActionState> {
  // 1. 로그인 체크
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect(ROUTES.login);
  }

  // 2. meetingId 꺼내기 (없으면 에러)
  const meetingId = Number(formData.get("meetingId"));

  if (!meetingId || meetingId < 1 || !Number.isInteger(meetingId)) {
    return {
      ok: false,
      error: "잘못된 요청입니다. (meetingId 없음)",
    };
  }

  // 3. FormData → MoimCreateFormValues로 파싱 (실패하면 에러 메시지 반환)
  let parsed: MoimCreateFormValues;

  try {
    parsed = parseMoimFormData(formData);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "입력값이 올바르지 않습니다.",
    };
  }

  // 4. use-case 호출
  try {
    await updateMoim({
      meetingId,
      data: parsed,
    });

    // 5. 성공 시 상세 페이지로 이동
    redirect(`${ROUTES.moimDetail}/${meetingId}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;

    return {
      ok: false,
      error: e instanceof Error ? e.message : "모임 수정에 실패했습니다.",
    };
  }
}
