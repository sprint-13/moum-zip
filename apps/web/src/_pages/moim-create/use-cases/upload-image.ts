import { getImagePresignedUrl } from "@/_pages/moim-create/actions";

export async function uploadImage(file: File): Promise<string> {
  const { presignedUrl, publicUrl } = await getImagePresignedUrl(file.name, file.type);
  await fetch(presignedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  return publicUrl;
}
