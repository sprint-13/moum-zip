// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5b6f65fbca7ff787b43b1ddcd6b9926f@o4511193059622912.ingest.us.sentry.io/4511193120899072",

  // 민감 정보(이메일 등) 자동 수집 비활성화
  sendDefaultPii: false,
});
