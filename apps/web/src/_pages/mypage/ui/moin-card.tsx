"use client";

import { Badge, Button, CheckCircleIcon } from "@ui/components";
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

function HeartButton({ liked }: { liked: boolean }) {
  const [isLiked, setIsLiked] = useState(liked);

  return (
    <button
      type="button"
      aria-label={isLiked ? "찜한 모임 해제" : "모임 찜하기"}
      aria-pressed={isLiked}
      onClick={() => setIsLiked((prev) => !prev)}
      className={cn(
        "flex size-12 items-center justify-center rounded-full border transition-colors",
        isLiked ? "border-primary/20 text-primary" : "border-border text-muted-foreground",
      )}
    >
      <Heart
        className={cn("size-6", isLiked ? "fill-current stroke-current" : "fill-none stroke-current")}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </button>
  );
}

function MoimPreview({ imageTone }: { imageTone: MoimImageTone }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-3xl xl:size-[11.75rem]",
        imageToneClassName[imageTone],
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/6" />
    </div>
  );
}

export default function MoimCard({ moim }: MoimCardProps) {
  return (
    <article className="flex w-full flex-col gap-5 rounded-3xl bg-card p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:gap-6 lg:p-6 xl:h-[14.75rem] xl:w-[59.875rem] xl:px-6 xl:py-6">
      <div className="w-full max-w-full xl:w-[11.75rem] xl:min-w-[11.75rem]">
        <MoimPreview imageTone={moim.imageTone} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
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
      </div>

      <div className="flex items-center justify-between gap-4 xl:ml-auto xl:w-[11rem] xl:flex-col xl:items-end xl:self-stretch">
        <HeartButton liked={moim.liked} />

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
