"use server";

import { getAuthenticatedApi } from "@/shared/api/auth-client";

type ImageContentType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

type Deps = {
  getAuthApi?: () => ReturnType<typeof getAuthenticatedApi>;
};

export async function getImagePresignedUrl(
  fileName: string,
  contentType: string,
  { getAuthApi = getAuthenticatedApi }: Deps = {},
) {
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
      const body = await e.json();
      throw new Error(`이미지 업로드 실패: ${body.message}`);
    }
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}
