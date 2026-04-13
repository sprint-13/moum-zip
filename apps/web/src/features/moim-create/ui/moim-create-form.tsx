"use client";

import { useRouter } from "next/navigation";
import { useMoimCreateAmplitudeTracking } from "@/features/moim-create/hooks/use-moim-create-amplitude-tracking";
import { useMoimCreateForm } from "@/features/moim-create/hooks/use-moim-create-form";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { trackMoimCreateEvent } from "@/features/moim-create/lib/moim-create-events";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";

export const MoimCreateForm = () => {
  const router = useRouter();
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  // 진입 및 제출 실패 amplitude 이벤트
  useMoimCreateAmplitudeTracking(state);

  return (
    <MoimFormFields
      form={form}
      onSubmit={onSubmit}
      state={state}
      isPending={isPending}
      isImageUploading={isImageUploading}
      submitLabel={isPending ? "생성 중" : "모임 만들기"}
      onCancel={() => {
        trackMoimCreateEvent("moim_create_canceled");
        router.back();
      }}
      onImageUpload={handleImageUpload}
    />
  );
};
