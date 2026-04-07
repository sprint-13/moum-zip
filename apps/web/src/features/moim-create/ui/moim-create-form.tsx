"use client";

import { useRouter } from "next/navigation";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { useMoimCreateForm } from "@/features/moim-create/model/use-moim-create-form";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";

export const MoimCreateForm = () => {
  const router = useRouter();
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  return (
    <MoimFormFields
      form={form}
      onSubmit={onSubmit}
      state={state}
      isPending={isPending}
      isImageUploading={isImageUploading}
      submitLabel={isPending ? "생성 중" : "모임 만들기"}
      onCancel={() => router.back()}
      onImageUpload={handleImageUpload}
    />
  );
};
