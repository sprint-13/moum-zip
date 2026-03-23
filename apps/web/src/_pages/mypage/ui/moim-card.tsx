"use client";

import { Badge, Button, CheckCircleIcon, UtilityButton } from "@ui/components";
import { Heart } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import type { MoimCardMockData, MoimImageTone } from "../mock-data";

interface MoimCardProps {
  moim: MoimCardMockData;
}

const imageToneClassName: Record<MoimImageTone, string> = {
  beige: "bg-[#E7D8C7]",
  daylight: "bg-[#D7EEF7]",
  sunset: "bg-[#F5C29B]",
  city: "bg-[#CBD5E1]",
};

const metaLabelClassName = "text-muted-foreground";

interface HeartButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

function HeartButton({ isLiked, onToggle, className }: HeartButtonProps) {
  return (
    <UtilityButton
      active={isLiked}
      aria-label={isLiked ? "찜한 모임 해제" : "모임 찜하기"}
      aria-pressed={isLiked}
      onClick={onToggle}
      icon={(size) => (
        <Heart
          size={size}
          strokeWidth={1.8}
          style={{
            fill: isLiked ? "url(#icon-gradient)" : "none",
            stroke: isLiked ? "url(#icon-gradient)" : "currentColor",
          }}
          aria-hidden="true"
        />
      )}
      className={className}
    />
  );
}

interface MoimPreviewProps {
  imageTone: MoimImageTone;
  className?: string;
}

function MoimPreview({ imageTone, className }: MoimPreviewProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", imageToneClassName[imageTone], className)}>
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/6" />
    </div>
  );
}

export default function MoimCard({ moim }: MoimCardProps) {
  const [isLiked, setIsLiked] = useState(moim.liked);

  return (
    <article className="flex min-h-[24.375rem] w-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm md:min-h-[14.75rem] md:flex-row md:items-center md:gap-6 md:p-6 md:shadow-sm xl:h-[14.75rem] xl:w-[59.875rem]">
      <div className="relative w-full md:w-[11.75rem] md:min-w-[11.75rem]">
        <MoimPreview
          imageTone={moim.imageTone}
          className="aspect-[343/156] rounded-t-3xl md:aspect-square md:size-[11.75rem] md:rounded-3xl"
        />
        <div className="absolute top-4 right-4 md:hidden">
          <HeartButton isLiked={isLiked} onToggle={() => setIsLiked((prev) => !prev)} className="bg-white shadow-sm" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={moim.primaryBadge.variant}>{moim.primaryBadge.label}</Badge>
          {moim.secondaryBadge ? (
            <Badge variant={moim.secondaryBadge.variant}>
              {moim.secondaryBadge.withIcon ? <CheckCircleIcon /> : null}
              {moim.secondaryBadge.label}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-5">
          <h3 className="font-bold text-2xl text-foreground leading-tight">{moim.title}</h3>

          <div className="space-y-2 text-base text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <svg viewBox="0 0 20 20" className="size-4 fill-current text-muted-foreground" aria-hidden="true">
                <path d="M10 10a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 10 10Zm0 1.875c-3.127 0-5.625 1.655-5.625 3.75A.625.625 0 0 0 5 16.25h10a.625.625 0 0 0 .625-.625c0-2.095-2.498-3.75-5.625-3.75Z" />
              </svg>
              <span>{moim.participantCount}</span>
            </div>

            <p className="leading-relaxed">
              <span className={metaLabelClassName}>위치</span> {moim.location}
              <span className="mx-2 text-border">|</span>
              <span className={metaLabelClassName}>날짜</span> {moim.date}
              <span className="mx-2 text-border">|</span>
              <span className={metaLabelClassName}>시간</span> {moim.time}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={moim.actionVariant === "primary" ? "primary" : "secondary"}
          size="small"
          className="mt-auto h-12 min-w-[9.75rem] self-end text-base md:hidden"
        >
          {moim.actionLabel}
        </Button>
      </div>

      <div className="hidden items-center justify-between gap-4 md:ml-auto md:flex md:w-[11rem] md:flex-col md:items-end md:self-stretch">
        <HeartButton isLiked={isLiked} onToggle={() => setIsLiked((prev) => !prev)} className="bg-card" />

        <Button
          type="button"
          variant={moim.actionVariant === "primary" ? "primary" : "secondary"}
          size="small"
          className="h-12 min-w-[9.75rem] text-base"
        >
          {moim.actionLabel}
        </Button>
      </div>
    </article>
  );
}
