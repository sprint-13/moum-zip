"use client";

import dynamic from "next/dynamic";

const Loading = () => (
  <div className="flex h-48 items-center justify-center">
    <span className="text-gray-500">스페이스 목록을 불러오는 중...</span>
  </div>
);

export const SpaceSection = dynamic(
  () =>
    import("@/_pages/spaces").then((mod) => ({
      default: mod.SpaceSection,
    })),
  {
    ssr: false,
    loading: Loading,
  },
);
