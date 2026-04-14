"use client";

import { Badge, Button, CheckCircleIcon, UtilityButton } from "@ui/components";
import { Heart } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";
import type { MoimImageTone, MypageMoimCard } from "../model/types";

interface MoimCardProps {
  moim: MypageMoimCard;
  onToggleLike?: (meetingId: string) => void;
  onEnterSpace?: (meetingId: string) => void;
  showActionButton?: boolean;
}

const imageToneClassName: Record<MoimImageTone, string> = {
  beige: "bg-[#E7D8C7]",
  daylight: "bg-[#D7EEF7]",
  sunset: "bg-[#F5C29B]",
  city: "bg-[#CBD5E1]",
};

const metaLabelClassName = "text-muted-foreground";
const cardWrapperClassName = "group/card -m-1 w-full rounded-[2rem] p-1";
const cardClassName =
  "relative flex min-h-[24.375rem] w-full flex-col overflow-hidden rounded-3xl bg-card shadow-[0_10px_24px_rgba(17,17,17,0.09)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none md:min-h-[14.75rem] md:flex-row md:items-center md:gap-6 md:p-6 md:shadow-[0_10px_24px_rgba(17,17,17,0.09)] md:group-hover/card:-translate-y-0.5 md:group-hover/card:shadow-[0_16px_32px_rgba(17,17,17,0.14)] motion-reduce:md:group-hover/card:translate-y-0 xl:h-[14.75rem] xl:w-[59.875rem]";
const cardImageClassName =
  "aspect-[343/156] rounded-t-3xl transition-transform duration-300 ease-out motion-reduce:transition-none md:aspect-square md:size-[11.75rem] md:rounded-3xl md:group-hover/card:scale-[1.015] motion-reduce:md:group-hover/card:scale-100";
const cardTitleClassName =
  "font-bold text-2xl text-foreground leading-tight transition-colors duration-300 motion-reduce:transition-none md:group-hover/card:text-primary";

interface HeartButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  className?: string;
}

const HeartButton = ({ isLiked, onToggle, className }: HeartButtonProps) => {
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
};

interface MoimPreviewProps {
  imageTone: MoimImageTone;
  imageUrl?: string;
  className?: string;
}

const FALLBACK_MOIM_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" fill="none"><rect width="640" height="640" rx="48" fill="#F2F4F7"/><path d="M188 420V220H452V420H188Z" fill="#D0D5DD"/><circle cx="262" cy="276" r="36" fill="#98A2B3"/><path d="M224 388L306 306L368 368L410 326L452 388H224Z" fill="#98A2B3"/></svg>',
)}`;

const MoimPreview = ({ imageTone, imageUrl, className }: MoimPreviewProps) => {
  const normalizedImageUrl = imageUrl?.trim();

  return (
    <div className={cn("relative w-full overflow-hidden", imageToneClassName[imageTone], className)}>
      <Image
        alt=""
        className="object-cover"
        fill
        src={normalizedImageUrl ? normalizedImageUrl : FALLBACK_MOIM_IMAGE}
        unoptimized
      />
    </div>
  );
};

export const MoimCard = ({ moim, onToggleLike, onEnterSpace, showActionButton = true }: MoimCardProps) => {
  const actionVariant = moim.actionVariant === "primary" ? "primary" : "secondary";
  const detailHref = `${ROUTES.moimDetail}/${moim.id}`;

  const handleToggleLike = () => {
    onToggleLike?.(moim.id);
  };

  const renderActionButton = (className?: string) => (
    <Button
      type="button"
      variant={actionVariant}
      size="small"
      className={cn("relative z-20", className)}
      onClick={() => onEnterSpace?.(moim.id)}
    >
      {moim.actionLabel}
    </Button>
  );

  return (
    <div className={cardWrapperClassName}>
      <article className={cardClassName}>
        <Link
          aria-label={`${moim.title} 상세 페이지 보기`}
          className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none"
          href={detailHref}
          prefetch={false}
        />

        <div className="relative w-full md:w-[11.75rem] md:min-w-[11.75rem]">
          <MoimPreview imageTone={moim.imageTone} imageUrl={moim.imageUrl} className={cardImageClassName} />
          <div className="absolute top-4 right-4 z-20 md:hidden">
            <HeartButton isLiked={moim.liked} onToggle={handleToggleLike} className="bg-white shadow-sm" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-0">
          {moim.primaryBadge || moim.secondaryBadge ? (
            <div className="flex flex-wrap items-center gap-2">
              {moim.primaryBadge ? <Badge variant={moim.primaryBadge.variant}>{moim.primaryBadge.label}</Badge> : null}
              {moim.secondaryBadge ? (
                <Badge variant={moim.secondaryBadge.variant}>
                  {moim.secondaryBadge.withIcon ? <CheckCircleIcon /> : null}
                  {moim.secondaryBadge.label}
                </Badge>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-5">
            <h3 className={cardTitleClassName}>{moim.title}</h3>

            <div className="space-y-2 text-base text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <svg viewBox="0 0 20 20" className="size-4 fill-current text-muted-foreground" aria-hidden="true">
                  <path d="M10 10a3.75 3.75 0 1 0 0-7.5A3.75 3.75 0 0 0 10 10Zm0 1.875c-3.127 0-5.625 1.655-5.625 3.75A.625.625 0 0 0 5 16.25h10a.625.625 0 0 0 .625-.625c0-2.095-2.498-3.75-5.625-3.75Z" />
                </svg>
                <span>{moim.participantCount}</span>
              </div>

              <p className="leading-relaxed">
                {moim.location}
                <span className="mx-2 text-border">|</span>
                <span className={metaLabelClassName}>날짜</span> {moim.date}
                <span className="mx-2 text-border">|</span>
                <span className={metaLabelClassName}>시간</span> {moim.time}
              </p>
            </div>
          </div>

          {showActionButton ? renderActionButton("mt-auto h-12 min-w-[9.75rem] self-end text-base md:hidden") : null}
        </div>

        <div className="hidden items-center justify-between gap-4 md:ml-auto md:flex md:w-[11rem] md:flex-col md:items-end md:self-stretch">
          <HeartButton isLiked={moim.liked} onToggle={handleToggleLike} className="relative z-20 bg-card" />

          {showActionButton ? renderActionButton("h-12 min-w-[9.75rem] text-base") : null}
        </div>
      </article>
    </div>
  );
};
