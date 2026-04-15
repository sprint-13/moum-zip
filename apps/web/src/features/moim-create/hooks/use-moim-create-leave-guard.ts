"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SEARCH_PATH = "/search";

type UseMoimCreateLeaveGuardOptions = {
  isDirty: boolean;
};

// 사용자가 작성 중일 때 브라우저 이탈을 제어하기 위한 hook
// - 뒤로가기 / 새로고침 시 바로 이탈하지 않고 확인 모달을 띄움
export const useMoimCreateLeaveGuard = ({ isDirty }: UseMoimCreateLeaveGuardOptions) => {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 나가기를 선택한 경우에만 브라우저 이탈 허용
  const allowLeaveRef = useRef(false);
  // 뒤로가기 시 바로 페이지를 이탈하지 않도록, 현재 히스토리에 방어용 엔트리를 1회 추가
  const guardInsertedRef = useRef(false);
  // popstate 이벤트에서 최신 모달 상태를 참조하기 위한 ref
  const isCancelModalOpenRef = useRef(false);

  useEffect(() => {
    isCancelModalOpenRef.current = isCancelModalOpen;
  }, [isCancelModalOpen]);

  // dirty 상태가 처음 활성화될 때만 방어용 history entry 추가
  useEffect(() => {
    if (!isDirty || guardInsertedRef.current) return;

    guardInsertedRef.current = true;
    window.history.pushState({ __moim_leave__: true }, "", window.location.href);
  }, [isDirty]);

  // 브라우저 뒤로가기 감지 - 작성 중이면 모달 오픈 + 현재 페이지 유지
  useEffect(() => {
    const handlePopState = () => {
      if (allowLeaveRef.current || !isDirty) return;

      if (!isCancelModalOpenRef.current) {
        setIsCancelModalOpen(true);
      }

      window.history.pushState({ __moim_leave__: true }, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  // 새로고침 / 탭 닫기 / 주소창 이동 감지
  // - 브라우저 정책상 커스텀 모달은 불가능, 기본 경고만 표시 가능
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current || !isDirty) return;

      event.preventDefault();
      event.returnValue = ""; // 일부 브라우저 호환용
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 모달 열기 / 닫기 상태 제어
  const openCancelModal = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    allowLeaveRef.current = false;
    setIsCancelModalOpen(false);
  }, []);

  // 나가기 - guard를 해제하고 /search로 이동
  const leaveToSearch = useCallback(() => {
    allowLeaveRef.current = true;
    setIsCancelModalOpen(false);
    router.replace(SEARCH_PATH);
  }, [router]);

  // 취소 버튼 클릭 - dirty 상태면 확인 모달, 아니면 바로 /search로 이동
  const handleCancelClick = useCallback(() => {
    if (!isDirty) {
      leaveToSearch();
      return;
    }
    openCancelModal();
  }, [isDirty, leaveToSearch, openCancelModal]);

  // AlertModal의 open 상태 변경을 현재 모달 상태와 동기화
  const handleCancelModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeCancelModal();
        return;
      }

      openCancelModal();
    },
    [openCancelModal, closeCancelModal],
  );

  return {
    isCancelModalOpen,
    leaveToSearch,
    handleCancelClick,
    handleCancelModalOpenChange,
  };
};
