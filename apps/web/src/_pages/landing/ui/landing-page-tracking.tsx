"use client";

import { useEffect } from "react";
import { trackLandingEntered } from "../lib/landing-events";

// 랜딩 페이지 진입 시 1회 전송
export function LandingPageTracking() {
  useEffect(() => {
    trackLandingEntered();
  }, []);

  return null;
}
