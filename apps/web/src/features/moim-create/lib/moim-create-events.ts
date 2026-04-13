"use client";

import amplitude from "@/amplitude";

const PAGE = "moim_create" as const;

type Step = "datetime" | "deadline_datetime";

type MoimCreateEventName =
  | "moim_create_entered"
  | "moim_create_image_upload_result"
  | "moim_create_step_completed"
  | "moim_create_submit_clicked"
  | "moim_create_canceled";

function canTrack() {
  return Boolean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
}

// 내부 공통 track 함수
function track(eventName: MoimCreateEventName, properties: Record<string, unknown> = {}) {
  if (!canTrack()) return;

  try {
    amplitude.track(eventName, {
      page: PAGE,
      ...properties,
    });
  } catch {
    // 분석 전송 실패는 사용자 플로우에 영향 없음 / Sentry 등으로 별도 검토 예정
  }
}

// 모임 생성 이벤트 전용 헬퍼
// 컴포넌트에서는 amplitude.track을 직접 호출하지 않고 아래 함수를 통해 이벤트 전송
export function trackMoimCreateEntered() {
  track("moim_create_entered");
}
export function trackMoimCreateSubmitClicked() {
  track("moim_create_submit_clicked");
}
export function trackMoimCreateCanceled() {
  track("moim_create_canceled");
}
export function trackMoimCreateStepCompleted(step: Step) {
  track("moim_create_step_completed", { step });
}
export function trackMoimCreateImageUploadResult(success: boolean) {
  track("moim_create_image_upload_result", { success });
}
