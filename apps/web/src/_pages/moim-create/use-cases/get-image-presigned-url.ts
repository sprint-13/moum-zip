"use server";

import { getAuthenticatedApi } from "@/shared/api/auth-client";

type ImageContentType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

const ALLOWED_CONTENT_TYPES: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function getResponseErrorDetail(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: unknown };
    return typeof body.message === "string" ? body.message : "알 수 없는 응답 오류";
  } catch {
    return `HTTP ${res.status}`;
  }
}

type Deps = {
  getAuthApi?: () => ReturnType<typeof getAuthenticatedApi>;
};

export async function getImagePresignedUrl(
  fileName: string,
  contentType: string,
  { getAuthApi = getAuthenticatedApi }: Deps = {},
) {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new Error(`허용되지 않는 파일 형식입니다: ${contentType}`);
  }

  try {
    const authedApi = await getAuthApi();
    const { data } = await authedApi.images.create({
      fileName,
      contentType: contentType as ImageContentType,
      folder: "meetings",
    });
    return data;
  } catch (e) {
    if (e instanceof Response) {
      const detail = await getResponseErrorDetail(e);
      throw new Error(`이미지 업로드 실패: ${detail}`);
    }
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}
