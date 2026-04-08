"use client";

import { ArrowLeft } from "@moum-zip/ui/icons";
import { useRouter } from "next/navigation";

export function PostDetailHeader() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-neutral-500 text-sm transition-colors hover:text-foreground"
      aria-label="뒤로 가기"
    >
      <ArrowLeft size={16} />
      뒤로 가기
    </button>
  );
}
