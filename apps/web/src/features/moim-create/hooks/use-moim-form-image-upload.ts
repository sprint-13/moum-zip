"use client";

import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { uploadImage } from "@/_pages/moim-create/use-cases/upload-image";
import type { MoimCreateFormValues } from "@/entities/moim";
import { trackMoimCreateEvent } from "@/features/moim-create/lib/moim-create-events";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export const useMoimFormImageUpload = (form: UseFormReturn<MoimCreateFormValues>) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { setError, clearErrors } = form;

  const handleImageUpload = useCallback(
    async (onChange: (url: string) => void) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = IMAGE_ACCEPT;

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setIsImageUploading(true);
        try {
          const publicUrl = await uploadImage(file);
          onChange(publicUrl);
          clearErrors("image");
          trackMoimCreateEvent("moim_create_image_upload_result", { success: true });
        } catch {
          setError("image", {
            type: "manual",
            message: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
          });
          trackMoimCreateEvent("moim_create_image_upload_result", { success: false });
        } finally {
          setIsImageUploading(false);
        }
      };

      input.click();
    },
    [setError, clearErrors],
  );
  return { isImageUploading, handleImageUpload };
};
