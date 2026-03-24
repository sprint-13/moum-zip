"use client";

import { cn } from "@ui/lib/utils";

interface DescriptionSectionProps {
  title?: string;
  description: string;
  className?: string;
  contentClassName?: string;
}

export function DescriptionSection({
  title = "모임 설명",
  description,
  className,
  contentClassName,
}: DescriptionSectionProps) {
  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <h2 className="font-semibold text-2xl text-black leading-[1.4]">{title}</h2>

      <div
        className={cn(
          "rounded-[32px] bg-white px-6 py-6 font-normal text-base text-gray-700 leading-7 md:px-12 md:text-lg",
          contentClassName,
        )}
      >
        <p className="wrap-break-word whitespace-pre-line">{description}</p>
      </div>
    </section>
  );
}
