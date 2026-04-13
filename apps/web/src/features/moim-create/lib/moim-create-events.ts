"use client";

import amplitude from "@/amplitude";

type Step = "datetime" | "deadline_datetime";

type MoimCreateEventName =
  | "moim_create_entered"
  | "moim_create_image_upload_result"
  | "moim_create_step_completed"
  | "moim_create_submit_clicked"
  | "moim_create_submit_result"
  | "moim_create_canceled";

type BaseProps = {
  step?: Step;
  success?: boolean;
};

// 모임 생성 관련 Amplitude 이벤트를 한곳에서 전송
// 항상 page: moim_create를 붙여 대시보드에서 필터링
export function trackMoimCreateEvent(eventName: MoimCreateEventName, props: BaseProps = {}) {
  amplitude.track(eventName, {
    page: "moim_create",
    ...props,
  });
}
