import type { PresignedUrlRequest } from "@moum-zip/api";
import { NextResponse } from "next/server";
import { getAuthenticatedApi, isAuthenticated } from "@/shared/api/auth-client";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Response) {
    return error.status === 401;
  }

  return error instanceof Error && error.message.includes("401");
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    // 클라이언트는 이 내부 API만 호출하고, 실제 외부 인증 API 호출은 서버에서 처리합니다.
    const body = (await request.json()) as PresignedUrlRequest;
    const authedApi = await getAuthenticatedApi();
    const { data } = await authedApi.images.create(body);

    return NextResponse.json(data);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    return NextResponse.json({ message: "이미지 업로드 URL 발급에 실패했습니다." }, { status: 500 });
  }
}
