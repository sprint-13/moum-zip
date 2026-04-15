"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { createMoim } from "@/_pages/moim-create/use-cases/moim-create";
import { type MoimCreateFormValues, parseMoimFormData } from "@/entities/moim";
import { getApi, isAuth } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";
import { reportError } from "@/shared/lib/errors/report-error";

export type CreateMoimActionState = {
  ok: false;
  error: string;
} | null;

export const createMoimAction = async (
  _: CreateMoimActionState,
  formData: FormData,
): Promise<CreateMoimActionState> => {
  // 접근 검증
  const { authenticated, userId } = await isAuth();

  if (!authenticated || userId == null) {
    redirect(ROUTES.login);
  }

  // FormData 파싱 및 Zod 검증
  let parsed: MoimCreateFormValues;
  try {
    parsed = parseMoimFormData(formData);
  } catch (error) {
    await reportError(error, {
      fallbackMessage: "입력값이 올바르지 않습니다.",
      tags: { scope: "moim-create-action", stage: "parse" },
    });
    return {
      ok: false,
      error: await getErrorMessage(error, {
        fallbackMessage: "입력값이 올바르지 않습니다.",
      }),
    };
  }

  // use-case 호출 → 성공하면 모임 상세 페이지로 redirect
  try {
    const api = await getApi();
    const { meeting } = await createMoim(parsed, {
      userId,
      meetingsApi: api.meetings,
      userApi: api.user,
    });
    redirect(`${ROUTES.moimDetail}/${meeting.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    await reportError(error, {
      fallbackMessage: "모임 생성에 실패했습니다.",
      tags: { scope: "moim-create-action", stage: "submit" },
    });
    return {
      ok: false,
      error: await getErrorMessage(error, {
        fallbackMessage: "모임 생성에 실패했습니다.",
      }),
    };
  }
};
