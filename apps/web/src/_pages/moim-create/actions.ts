"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { parseMoimFormData } from "@/_pages/moim-create/lib/parse-moim-form-data";
import { createMoim } from "@/_pages/moim-create/use-cases/moim-create";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { isAuth } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

export type CreateMoimActionState = {
  ok: false;
  error: string;
} | null;

export async function createMoimAction(_: CreateMoimActionState, formData: FormData): Promise<CreateMoimActionState> {
  // 로그인 여부 확인
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect(ROUTES.login);
  }

  // FormData 파싱 및 Zod 검증
  let parsed: MoimCreateFormValues;
  try {
    parsed = parseMoimFormData(formData);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "입력값이 올바르지 않습니다." };
  }

  // use-case 호출 → 성공하면 모임 상세 페이지로 redirect
  try {
    const { meeting } = await createMoim(parsed);
    redirect(`${ROUTES.moimDetail}/${meeting.id}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return {
      ok: false,
      error: e instanceof Error ? e.message : "모임 생성에 실패했습니다.",
    };
  }
}
