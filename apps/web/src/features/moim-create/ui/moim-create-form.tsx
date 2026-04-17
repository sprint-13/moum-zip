"use client";

import { MOIM_CREATE_DEFAULT_VALUES, useMoimCreateForm } from "@/features/moim-create/hooks/use-moim-create-form";
import { useMoimCreateLeaveGuard } from "@/features/moim-create/hooks/use-moim-create-leave-guard";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { trackMoimCreateCanceled } from "@/features/moim-create/lib/moim-create-events";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";
import { AlertModal } from "@/shared/ui";

export const MoimCreateForm = () => {
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  const { isCancelModalOpen, leaveToSearch, handleCancelClick, handleCancelModalOpenChange } = useMoimCreateLeaveGuard({
    isDirty: form.formState.isDirty,
    shouldBlockBeforeUnload: form.formState.isDirty && !isPending,
  });

  const handleCancelConfirm = () => {
    trackMoimCreateCanceled();
    form.reset(MOIM_CREATE_DEFAULT_VALUES);
    leaveToSearch();
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

      <AlertModal open={isCancelModalOpen} onOpenChange={handleCancelModalOpenChange}>
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
