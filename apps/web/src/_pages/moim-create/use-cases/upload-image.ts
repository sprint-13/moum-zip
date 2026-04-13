import { getImagePresignedUrl } from "@/_pages/moim-create/use-cases/get-image-presigned-url";
import { ApiError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";

export const uploadImage = async (file: File): Promise<string> => {
  const { presignedUrl, publicUrl } = await getImagePresignedUrl(file.name, file.type);
  const res = await fetch(presignedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

  try {
    await throwIfNotOk(res, {
      fallbackMessage: "이미지 업로드에 실패했습니다.",
      shouldReport: false,
    });
  } catch (error) {
    throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
      cause: error,
      message: "이미지 업로드에 실패했습니다.",
      shouldReport: false,
    });
  }

  return publicUrl;
};
