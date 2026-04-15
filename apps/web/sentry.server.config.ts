// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production", // 배포 환경에서만 에러 트래킹 활성화
  // 민감 정보(이메일 등) 자동 수집 비활성화
  sendDefaultPii: false,
});
