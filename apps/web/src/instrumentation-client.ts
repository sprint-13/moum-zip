import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5b6f65fbca7ff787b43b1ddcd6b9926f@o4511193059622912.ingest.us.sentry.io/4511193120899072",

  integrations: [Sentry.replayIntegration()],

  // 일반 세션은 녹화하지 않음
  replaysSessionSampleRate: 0.0,

  // 에러 난 세션만 100% 녹화
  replaysOnErrorSampleRate: 1.0,

  // 민감 정보(이메일 등) 자동 수집 비활성화
  sendDefaultPii: false,

  // 브라우저 노이즈 에러 무시 (광고 차단기, 브라우저 확장 프로그램 등)
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
    /^Network Error$/,
    /^Failed to fetch$/,
    /^Load failed$/,
  ],

  // Sentry로 전송되기 직전에 실행되는 필터 함수
  // 혹시라도 유저 이메일이 포함된 경우 [filtered]로 가려서 개인정보 보호
  beforeSend(event) {
    if (event.user?.email) {
      event.user.email = "[filtered]";
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
