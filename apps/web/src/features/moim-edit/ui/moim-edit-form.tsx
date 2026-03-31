"use client";

import { useRouter } from "next/navigation";
import { uploadImage } from "@/_pages/moim-create/use-cases/upload-image";
import { MoimFormFields, type MoimFormValues } from "@/features/moim-create/ui/moim-form-fields";
import { useMoimEditForm } from "@/features/moim-edit/model/use-moim-edit-form";

interface MoimEditFormProps {
  meetingId: number;
  initialValues: MoimFormValues;
}

export const MoimEditForm = ({ meetingId, initialValues }: MoimEditFormProps) => {
  const router = useRouter();
  const { form, onSubmit, state, isPending } = useMoimEditForm({
    meetingId,
    initialValues,
  });

  const { setError, clearErrors } = form;

  const handleImageUpload = async (onChange: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const publicUrl = await uploadImage(file);
        onChange(publicUrl);
        clearErrors("image");
      } catch {
        setError("image", {
          type: "manual",
          message: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
        });
      }
    };

    input.click();
  };

  return (
    <MoimFormFields
      form={form}
      onSubmit={onSubmit}
      state={state}
      isPending={isPending}
      submitLabel={isPending ? "수정 중" : "수정하기"}
      onCancel={() => router.back()}
      onImageUpload={handleImageUpload}
    />
  );
};
