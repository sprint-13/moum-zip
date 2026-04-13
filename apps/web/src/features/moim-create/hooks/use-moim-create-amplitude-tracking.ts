"use client";

import { useEffect } from "react";
import { trackMoimCreateEntered } from "@/features/moim-create/lib/moim-create-events";

// 모임 생성 페이지 진입 시 1회 이벤트 전송
export function useMoimCreateAmplitudeTracking() {
  // 화면 진입
  useEffect(() => {
    trackMoimCreateEntered();
  }, []);
}
