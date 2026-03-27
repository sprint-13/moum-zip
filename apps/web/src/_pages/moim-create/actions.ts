"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseMoimFormData } from "@/_pages/moim-create/lib/parse-moim-form-data";
import { createMoim } from "@/_pages/moim-create/use-cases/moim-create";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { isAuthenticated } from "@/shared/api/auth-client";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";

export type CreateMoimActionState = {
  ok: false;
  error: string;
} | null;

export async function createMoimAction(_: CreateMoimActionState, formData: FormData): Promise<CreateMoimActionState> {
  // 로그인 여부 확인
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  let parsed: MoimCreateFormValues;
  try {
    parsed = parseMoimFormData(formData);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "입력값이 올바르지 않습니다." };
  }

  // 쿠키에서 accessToken 직접 추출
  // TODO: meetings.create 확인 후, createMoim 내부에서 처리하도록 리팩토링 예정
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  // use-case 호출 → 성공하면 /spaces/[slug]로 redirect
  try {
    const { space } = await createMoim(parsed, accessToken);
    redirect(`/spaces/${space.slug}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return {
      ok: false,
      error: e instanceof Error ? e.message : "모임 생성에 실패했습니다.",
    };
  }
}
