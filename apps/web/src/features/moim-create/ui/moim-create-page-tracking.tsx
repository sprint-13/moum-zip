"use client";

import { useEffect } from "react";
import { trackMoimCreateEntered } from "@/features/moim-create/lib/moim-create-events";

// 모임 생성 페이지 진입 시 1회 전송 (UI 없음 /분석 전용)
export function MoimCreatePageTracking() {
  useEffect(() => {
    trackMoimCreateEntered();
  }, []);

  return null;
}
