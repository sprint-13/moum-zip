"use client";

import { cn } from "@ui/lib/utils";
import Image from "next/image";

interface DescriptionSectionProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  hostName?: string;
  hostImage?: string | null;
}

export const DescriptionSection = ({
  title = "모임 설명",
  description = "",
  className,
  contentClassName,
  hostName,
  hostImage,
}: DescriptionSectionProps) => {
  const initial = hostName?.trim().charAt(0) ?? "";

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="font-semibold text-black text-xl leading-[1.4]">{title}</h2>

      <div className={cn("rounded-[1rem] bg-white px-6 py-5 md:px-8", contentClassName)}>
        {description ? (
          <p className="whitespace-pre-line break-words font-normal text-base text-gray-700 leading-[1.7] md:text-[17px]">
            {description}
          </p>
        ) : (
          <p className="font-normal text-base text-gray-400 leading-[1.6] md:text-[17px]">설명이 없습니다.</p>
        )}

        {hostName ? (
          <div className="mt-6 flex items-center gap-2.5">
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
              {hostImage ? (
                <Image src={hostImage} alt={`${hostName} 프로필 이미지`} fill className="object-cover" />
              ) : (
                <span className="font-medium text-[12px] text-slate-500">{initial}</span>
              )}
            </div>

            <span className="text-[13px] text-slate-400 leading-[1.4]">매니저</span>

            <span className="truncate font-medium text-[14px] text-slate-700 leading-[1.5]">{hostName}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
};
