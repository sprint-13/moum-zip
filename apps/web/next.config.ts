// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
