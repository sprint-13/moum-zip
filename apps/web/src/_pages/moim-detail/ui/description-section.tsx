"use client";

import { cn } from "@ui/lib/utils";

interface DescriptionSectionProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
}

export const DescriptionSection = ({
  title = "모임 설명",
  description = "",
  className,
  contentClassName,
}: DescriptionSectionProps) => {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="font-semibold text-black text-xl leading-[1.4]">{title}</h2>

      <div
        className={cn(
          "rounded-[1rem] bg-white px-6 py-5 font-normal text-base text-gray-700 leading-[1.6]",
          "md:px-8 md:text-[17Px]",
          contentClassName,
        )}
      >
        {description ? (
          <p className="whitespace-pre-line break-words">{description}</p>
        ) : (
          <p className="text-gray-400">설명이 없습니다.</p>
        )}
      </div>
    </section>
  );
};
