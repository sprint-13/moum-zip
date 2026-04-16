import { getImagePresignedUrl } from "@/_pages/moim-create/use-cases/get-image-presigned-url";
import { normalizeApiError, throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";

export const uploadImage = async (file: File): Promise<string> => {
  const { presignedUrl, publicUrl } = await getImagePresignedUrl(file.name, file.type);

  try {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    await throwIfNotOk(res, {
      fallbackMessage: "이미지 업로드에 실패했습니다.",
      shouldReport: false,
    });
  } catch (error) {
    throw await normalizeApiError(error, {
      fallbackMessage: "이미지 업로드에 실패했습니다.",
      shouldReport: false,
    });
  }

  return publicUrl;
};
