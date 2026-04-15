"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMoimCreateForm } from "@/features/moim-create/hooks/use-moim-create-form";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { trackMoimCreateCanceled } from "@/features/moim-create/lib/moim-create-events";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";
import { AlertModal } from "@/shared/ui";

export const MoimCreateForm = () => {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  // 폼 취소 - 아직 이탈 확정 아님, 확인 모달만 active
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // 모달 나가기 - 이탈 확정 → 트래킹 후 뒤로가기
  const handleCancelConfirm = () => {
    trackMoimCreateCanceled();
    router.back();
    setIsCancelModalOpen(false);
  };

  return (
    <>
      <MoimFormFields
        form={form}
        onSubmit={onSubmit}
        state={state}
        isPending={isPending}
        isImageUploading={isImageUploading}
        submitLabel={isPending ? "생성 중" : "모임 만들기"}
        onCancel={handleCancelClick}
        onImageUpload={handleImageUpload}
      />

      <AlertModal open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertModal.Content
          title="작성을 취소하시겠어요?"
          description="작성 중인 내용은 저장되지 않고 사라집니다."
          cancelText="계속 작성"
          actionText="나가기"
          onAction={handleCancelConfirm}
        />
      </AlertModal>
    </>
  );
};
