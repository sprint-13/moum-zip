"use client";

import { IcoChevronDownDouble } from "@/_pages/landing/ui/ico-chevron-down-double";

export const LandingScrollButton = () => (
  <button
    type="button"
    aria-label="다음 섹션으로 이동"
    className="mx-auto mt-auto mb-6 animate-bounce motion-reduce:animate-none lg:mb-10"
    onClick={() =>
      document.getElementById("landing-find")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  >
    <IcoChevronDownDouble />
  </button>
);
