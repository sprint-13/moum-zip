// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

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
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
