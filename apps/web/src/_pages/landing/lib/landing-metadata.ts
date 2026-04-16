import type { Metadata } from "next";
import { ROUTES } from "@/shared/config/routes";
import { RESOLVED_SITE_URL } from "@/shared/config/site";

const LANDING_PAGE_TITLE = "혼자보다 함께";
const LANDING_PAGE_DESCRIPTION =
  "나에게 꼭 맞는 스터디와 프로젝트 모임을 찾고, 전용 스페이스에서 소통하며 목표를 달성하세요. 멤버 모집부터 활동 운영까지, 커뮤니티의 모든 과정을 하나로 연결합니다.";

export const landingMetadata: Metadata = {
  title: LANDING_PAGE_TITLE,
  description: LANDING_PAGE_DESCRIPTION,
  alternates: {
    canonical: ROUTES.home,
  },
  openGraph: {
    title: LANDING_PAGE_TITLE,
    description: LANDING_PAGE_DESCRIPTION,
    url: RESOLVED_SITE_URL,
    type: "website",
    images: [
      {
        url: "/og/landing.png",
        width: 1200,
        height: 630,
        alt: "모음.zip 랜딩 페이지",
      },
    ],
  },
};
