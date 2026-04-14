"use client";

import amplitude from "@/amplitude";

const PAGE = "moim_create" as const;
const AMPLITUDE_ENABLED = Boolean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

type Step = "datetime" | "deadline_datetime";

type MoimCreateEventPayloadByName = {
  // payload 없는 이벤트
  moim_create_entered: undefined;
  moim_create_submit_clicked: undefined;
  moim_create_canceled: undefined;
  // payload 필수 이벤트
  moim_create_step_completed: { step: Step };
  moim_create_image_upload_result: { success: boolean };
};

// payload 매핑 키를 이벤트 이름 타입으로 사용
type MoimCreateEventName = keyof MoimCreateEventPayloadByName;

// 내부 공통 track 함수
const track = <EventName extends MoimCreateEventName>(
  eventName: EventName,
  // payload가 없는 이벤트는 인자 없이, 있는 이벤트는 타입 강제
  ...payload: MoimCreateEventPayloadByName[EventName] extends undefined ? [] : [MoimCreateEventPayloadByName[EventName]]
) => {
  if (!AMPLITUDE_ENABLED) return;

  try {
    amplitude.track(eventName, {
      page: PAGE,
      ...(payload[0] ?? {}),
    });
  } catch {
    // 분석 전송 실패는 사용자 플로우에 영향 없음 / Sentry 등으로 별도 검토 예정
  }
};

// 모임 생성 이벤트 전용 헬퍼
// 컴포넌트에서는 amplitude.track을 직접 호출하지 않고 아래 함수를 통해 이벤트 전송
export const trackMoimCreateEntered = () => {
  track("moim_create_entered");
};
export const trackMoimCreateSubmitClicked = () => {
  track("moim_create_submit_clicked");
};
export const trackMoimCreateCanceled = () => {
  track("moim_create_canceled");
};
export const trackMoimCreateStepCompleted = (step: Step) => {
  track("moim_create_step_completed", { step });
};
export const trackMoimCreateImageUploadResult = (success: boolean) => {
  track("moim_create_image_upload_result", { success });
};
