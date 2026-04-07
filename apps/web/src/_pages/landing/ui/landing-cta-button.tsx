"use client";

import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";

type Props = {
  size: "medium" | "large";
  className?: string;
};

export const LandingCtaButton = ({ size, className }: Props) => {
  const sizeClass = size === "large" ? "h-[60px] min-w-[474px] px-6 text-xl" : "h-12 min-w-[311px] px-5 text-base";

  return (
    <Link
      href={ROUTES.search}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary font-semibold text-white transition-colors hover:bg-green-600",
        sizeClass,
        className,
      )}
    >
      모임 찾아보기
    </Link>
  );
};
