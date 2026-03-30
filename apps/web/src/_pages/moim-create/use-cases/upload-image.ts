import { getImagePresignedUrl } from "@/_pages/moim-create/use-cases/get-image-presigned-url";

export async function uploadImage(file: File): Promise<string> {
  const { presignedUrl, publicUrl } = await getImagePresignedUrl(file.name, file.type);
  const res = await fetch(presignedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

  if (!res.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return publicUrl;
}
