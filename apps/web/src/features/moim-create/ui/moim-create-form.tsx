"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MOIM_CREATE_DEFAULT_VALUES, useMoimCreateForm } from "@/features/moim-create/hooks/use-moim-create-form";
import { useMoimFormImageUpload } from "@/features/moim-create/hooks/use-moim-form-image-upload";
import { trackMoimCreateCanceled } from "@/features/moim-create/lib/moim-create-events";
import { MoimFormFields } from "@/features/moim-create/ui/moim-form-fields";
import { AlertModal } from "@/shared/ui";

const SEARCH_PATH = "/search";

export const MoimCreateForm = () => {
  const router = useRouter();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const { isImageUploading, handleImageUpload } = useMoimFormImageUpload(form);

  // 작성 중일 때만 이탈 가드 활성화
  const isDirty = form.formState.isDirty;

  // 명시적으로 이탈을 허용한 경우 popstate / beforeunload 가드를 통과시키기 위한 플래그
  const allowLeaveRef = useRef(false);
  // guard용 history entry는 최초 1회만 삽입
  const guardInsertedRef = useRef(false);
  // 이벤트 핸들러에서 최신 모달 상태를 읽기 위한 ref
  const isCancelModalOpenRef = useRef(false);

  // dirty 상태가 처음 활성화될 때만 현재 URL 위에 guard용 history entry 1개 추가
  // - 뒤로가기 시 바로 페이지를 이탈하지 않고, popstate에서 모달을 띄울 수 있도록 하기 위함
  useEffect(() => {
    if (!isDirty || guardInsertedRef.current) return;

    guardInsertedRef.current = true;
    window.history.pushState({ __moim_leave__: true }, "", window.location.href);
  }, [isDirty]);

  // 최신 모달 상태를 ref에 동기화
  useEffect(() => {
    isCancelModalOpenRef.current = isCancelModalOpen;
  }, [isCancelModalOpen]);

  // 브라우저 뒤로가기 감지
  // - 작성 중이면 모달을 띄우고, pushState로 현재 페이지 유지
  useEffect(() => {
    const onPopState = () => {
      if (allowLeaveRef.current) return;
      if (!isDirty) return;

      if (isCancelModalOpenRef.current) {
        window.history.pushState({ __moim_leave__: true }, "", window.location.href);
        return;
      }

      setIsCancelModalOpen(true);
      window.history.pushState({ __moim_leave__: true }, "", window.location.href);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isDirty]);

  // 새로고침 / 탭 닫기 / 주소창 이동 감지
  // - 브라우저 정책상 커스텀 모달은 불가능, 기본 경고만 표시 가능
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      if (!isDirty) return;

      event.preventDefault();
      // 일부 브라우저 호환용
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // 이탈 - 히스토리에 의존하지 않고 /search로 이동
  const leaveToSearch = () => {
    allowLeaveRef.current = true;
    setIsCancelModalOpen(false);
    router.replace(SEARCH_PATH);
  };

  // 취소 버튼 클릭 - dirty 상태면 확인 모달, 아니면 바로 /search로 이동
  const handleCancelClick = () => {
    if (!isDirty) {
      leaveToSearch();
      return;
    }
    setIsCancelModalOpen(true);
  };

  // 모달 계속 작성
  const handleCancelKeepEditing = () => {
    allowLeaveRef.current = false;
    setIsCancelModalOpen(false);
  };

  // 모달 나가기
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

      <AlertModal
        open={isCancelModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelKeepEditing();
            return;
          }
          setIsCancelModalOpen(true);
        }}
      >
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
