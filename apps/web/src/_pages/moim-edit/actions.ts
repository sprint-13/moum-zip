"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { parseMoimFormData } from "@/entities/moim/model/parse-moim-form-data";
import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import { updateMoim } from "@/features/moim-edit/use-cases/moim-update";
import { ROUTES } from "@/shared/config/routes";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export type UpdateMoimActionState = {
  ok: false;
  error: string;
} | null;

export const updateMoimAction = async (
  _: UpdateMoimActionState,
  formData: FormData,
): Promise<UpdateMoimActionState> => {
  // 1. meetingId 꺼내기 (없으면 에러)
  const meetingId = Number(formData.get("meetingId"));

  if (!meetingId || meetingId < 1 || !Number.isInteger(meetingId)) {
    return {
      ok: false,
      error: "잘못된 요청입니다.",
    };
  }

  // 2. FormData → MoimCreateFormValues로 파싱 (실패하면 에러 메시지 반환)
  let parsed: MoimCreateFormValues;

  try {
    parsed = parseMoimFormData(formData);
  } catch (error) {
    return {
      ok: false,
      error: await getErrorMessage(error, {
        fallbackMessage: "입력값이 올바르지 않습니다.",
      }),
    };
  }

  // 3. use-case 호출
  try {
    await updateMoim({
      meetingId,
      data: parsed,
    });

    // 4. 성공 시 상세 페이지로 이동
    redirect(`${ROUTES.moimDetail}/${meetingId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      ok: false,
      error: await getErrorMessage(error, {
        fallbackMessage: "모임 수정에 실패했습니다.",
      }),
    };
  }
};
