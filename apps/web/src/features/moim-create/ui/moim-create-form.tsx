"use client";

import { useRouter } from "next/navigation";
import { useMoimCreateAmplitudeTracking } from "@/features/moim-create/hooks/use-moim-create-amplitude-tracking";
import { useMoimCreateForm } from "@/features/moim-create/hooks/use-moim-create-form";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { trackMoimCreateCanceled } from "@/features/moim-create/lib/moim-create-events";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";

export const MoimCreateForm = () => {
  const router = useRouter();
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  // 화면 진입 트래킹
  useMoimCreateAmplitudeTracking();

  return (
    <MoimFormFields
      form={form}
      onSubmit={onSubmit}
      state={state}
      isPending={isPending}
      isImageUploading={isImageUploading}
      submitLabel={isPending ? "생성 중" : "모임 만들기"}
      onCancel={() => {
        trackMoimCreateCanceled();
        router.back();
      }}
      onImageUpload={handleImageUpload}
    />
  );
};
