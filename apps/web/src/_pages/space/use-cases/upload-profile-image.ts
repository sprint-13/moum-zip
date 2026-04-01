const PROFILE_IMAGE_FOLDER = "users";

export const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const PROFILE_IMAGE_ACCEPT = ALLOWED_PROFILE_IMAGE_TYPES.join(",");

export const isAllowedProfileImageType = (
  contentType: string,
): contentType is (typeof ALLOWED_PROFILE_IMAGE_TYPES)[number] => {
  return ALLOWED_PROFILE_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_PROFILE_IMAGE_TYPES)[number]);
};

export async function uploadProfileImage(file: File): Promise<string> {
  if (!isAllowedProfileImageType(file.type)) {
    throw new Error("JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요.");
  }

  const response = await fetch("/api/images/presigned", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      folder: PROFILE_IMAGE_FOLDER,
    }),
  });

  if (!response.ok) {
    throw new Error("프로필 이미지 업로드 URL 발급에 실패했어요.");
  }

  const { presignedUrl, publicUrl } = (await response.json()) as {
    presignedUrl: string;
    publicUrl: string;
  };

  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("프로필 이미지 업로드에 실패했어요.");
  }

  return publicUrl;
}
