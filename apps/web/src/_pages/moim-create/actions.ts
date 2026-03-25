"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { createMoim } from "@/_pages/moim-create/use-cases/create-moim";
import { moimCreateSchema } from "@/features/moim-create/model/schema";
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

  // FormData 객체 변환
  const rawFormData = {
    type: formData.get("type"),
    name: formData.get("name"),
    capacity: Number(formData.get("capacity")),
    description: formData.get("description"),
    image: formData.get("image"),
    location: formData.get("location"),
    date: formData.get("date"),
    time: formData.get("time"),
    deadlineDate: formData.get("deadlineDate"),
    deadlineTime: formData.get("deadlineTime"),
    themeColor: formData.get("themeColor"),
    options: formData.getAll("options"),
  };

  // Zod 검증
  const parsed = moimCreateSchema.safeParse(rawFormData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  // 쿠키에서 accessToken 가져오기
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  // use-case 호출
  try {
    const { space } = await createMoim(parsed.data, accessToken);
    redirect(`/spaces/${space.slug}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return {
      ok: false,
      error: e instanceof Error ? e.message : "모임 생성에 실패했습니다.",
    };
  }
}
