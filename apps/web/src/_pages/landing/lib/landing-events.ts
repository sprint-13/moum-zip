"use client";

import amplitude from "@/amplitude";

const PAGE = "landing" as const;
const AMPLITUDE_ENABLED = Boolean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

type LandingEventPayloadByName = {
  landing_entered: {
    referrer: string;
  };
  landing_cta_clicked: {
    section: "hero" | "bottom";
    cta_name: "search_moim";
  };
};

type LandingEventName = keyof LandingEventPayloadByName;

// 내부 공통 track 함수
const track = <EventName extends LandingEventName>(
  eventName: EventName,
  payload: LandingEventPayloadByName[EventName],
) => {
  if (!AMPLITUDE_ENABLED) return;

  try {
    amplitude.track(eventName, {
      page: PAGE,
      ...payload,
    });
  } catch {
    // Amplitude 전송 실패는 무시, 사용자 플로우에 영향 없음
  }
};

// 랜딩 진입
export const trackLandingEntered = () => {
  track("landing_entered", {
    referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
  });
};

// CTA 클릭
export const trackLandingCtaClicked = (section: "hero" | "bottom") => {
  track("landing_cta_clicked", {
    section,
    cta_name: "search_moim",
  });
};
