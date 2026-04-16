import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.VERCEL_ENV === "production", // production 배포 환경에서만 에러 트래킹 활성화 (preview/로컬 제외)
  integrations: [Sentry.replayIntegration()],

  // 일반 세션은 녹화하지 않음
  replaysSessionSampleRate: 0.0,

  // 에러 난 세션만 100% 녹화
  replaysOnErrorSampleRate: 1.0,

  // 민감 정보(이메일 등) 자동 수집 비활성화
  sendDefaultPii: false,

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
