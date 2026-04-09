"use client";

import { useEffect } from "react";
import { trackMoimCreateEvent } from "@/features/moim-create/lib/moim-create-events";

// useActionState(createMoimAction)이 돌려주는 에러 상태
type MoimCreateState = { ok: false; error: string } | null;

// 모임 생성 화면 전용 Amplitude 트래킹
export function useMoimCreateAmplitudeTracking(state: MoimCreateState) {
  // 화면 진입
  useEffect(() => {
    trackMoimCreateEvent("moim_create_entered");
  }, []);

  // 서버 액션 실패 시에만 전송
  useEffect(() => {
    if (state?.ok !== false) return;
    trackMoimCreateEvent("moim_create_submit_result", {
      success: false,
    });
  }, [state]);
}
