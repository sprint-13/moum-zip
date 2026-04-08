"use client";

import { useRouter } from "next/navigation";
import type { MoimCreateFormValues } from "@/entities/moim";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";
import { useMoimEditForm } from "@/features/moim-edit/hooks/use-moim-edit-form";

interface MoimEditFormProps {
  meetingId: number;
  initialValues: MoimCreateFormValues;
}

export const MoimEditForm = ({ meetingId, initialValues }: MoimEditFormProps) => {
  const router = useRouter();
  const { form, onSubmit, state, isPending } = useMoimEditForm({
    meetingId,
    initialValues,
  });

  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  return (
    <MoimFormFields
      form={form}
      onSubmit={onSubmit}
      state={state}
      isPending={isPending}
      isImageUploading={isImageUploading}
      submitLabel={isPending ? "수정 중" : "수정하기"}
      onCancel={() => router.back()}
      onImageUpload={handleImageUpload}
    />
  );
};
