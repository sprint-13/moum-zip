import { withSentryConfig } from "@sentry/nextjs";
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactCompiler: {
    compilationMode: "annotation",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**", // 모든 경로의 이미지를 허용
      },
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net", // 카카오 프로필 이미지
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t1.kakaocdn.net", // 카카오 기본 프로필 이미지
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net", // 카카오 프로필 이미지 (로컬 테스트용)
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "t1.kakaocdn.net", // 카카오 기본 프로필 이미지 (로컬 테스트용)
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: "moum-zip-dev",
  project: "javascript-nextjs",

  // CI 환경에서만 소스맵 업로드 로그 출력
  silent: !process.env.CI,

  // 더 정확한 스택 트레이스를 위해 더 많은 소스맵 업로드
  widenClientFileUpload: true,

  // tunnelRoute: "/monitoring",

  // Vercel Cron Monitors 자동 계측
  automaticVercelMonitors: true,

  webpack: {
    // 번들 크기 최적화 - Sentry 디버그 로그 제거
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
