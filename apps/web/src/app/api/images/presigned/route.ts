import type { PresignedUrlRequest } from "@moum-zip/api";
import { NextResponse } from "next/server";
import { getApi, isAuth } from "@/shared/api/server";
import { ERROR_CODES } from "@/shared/lib/error";
import { normalizeApiError } from "@/shared/lib/errors/normalize-api-error";

export async function POST(request: Request) {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    // 클라이언트는 이 내부 API만 호출하고, 실제 외부 인증 API 호출은 서버에서 처리합니다.
    const body = (await request.json()) as PresignedUrlRequest;
    const authedApi = await getApi();
    const { data } = await authedApi.images.create(body);

    return NextResponse.json(data);
  } catch (error) {
    const normalizedError = await normalizeApiError(error, {
      fallbackMessage: "이미지 업로드 URL 발급에 실패했습니다.",
      shouldReport: false,
    });

    if (normalizedError.code === ERROR_CODES.UNAUTHORIZED || normalizedError.code === ERROR_CODES.UNAUTHENTICATED) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    return NextResponse.json({ message: normalizedError.message }, { status: 500 });
  }
}
