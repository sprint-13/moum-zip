"use server";

import { getApi } from "@/shared/api/server";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";

type ImageContentType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

const ALLOWED_CONTENT_TYPES: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const getResponseErrorDetail = async (res: Response): Promise<string> => {
  try {
    const body = (await res.json()) as { message?: unknown };
    return typeof body.message === "string" ? body.message : "알 수 없는 응답 오류";
  } catch {
    return `HTTP ${res.status}`;
  }
};

type Deps = {
  getAuthApi?: () => ReturnType<typeof getApi>;
};

export const getImagePresignedUrl = async (
  fileName: string,
  contentType: string,
  { getAuthApi = getApi }: Deps = {},
) => {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: `허용되지 않는 파일 형식입니다: ${contentType}`,
    });
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

      throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
        cause: e,
        message: `이미지 업로드 실패: ${detail}`,
        shouldReport: e.status >= 500,
        status: e.status,
      });
    }

    throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
      cause: e,
      message: "이미지 업로드에 실패했습니다.",
    });
  }
};
