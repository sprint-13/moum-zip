"use client";

import * as amplitude from "@amplitude/unified";
import { useEffect } from "react";

export function AmplitudeInit() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) return;

    amplitude.initAll(apiKey, {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
  }, []);

  return null;
}

export default amplitude;
