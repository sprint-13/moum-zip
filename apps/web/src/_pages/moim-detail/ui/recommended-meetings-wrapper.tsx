"use client";

import dynamic from "next/dynamic";
import type { RecommendedMeetingData } from "@/entities/moim-detail";

const RecommendedMeetingsClient = dynamic(
  () => import("@/_pages/moim-detail/ui/recommended-meetings-client").then((mod) => mod.RecommendedMeetingsClient),
  {
    ssr: false,
  },
);

interface Props {
  meetings: RecommendedMeetingData[];
}

export function RecommendedMeetingsWrapper({ meetings }: Props) {
  return <RecommendedMeetingsClient meetings={meetings} />;
}
