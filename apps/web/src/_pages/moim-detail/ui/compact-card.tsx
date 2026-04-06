import { Tag } from "@ui/components";
import { cn } from "@ui/lib/utils";
import type { ReactNode } from "react";
import { LikeButton } from "@/features/moim-detail/ui/like-button";

interface CompactCardProps {
  className?: string;
  image: ReactNode;
  deadlineLabel?: string;
  dateLabel?: string;
  timeLabel?: string;
  title: string;
  locationIcon?: ReactNode;
  locationText: string;
  isLiked?: boolean;
  onLikeClick?: () => boolean | Promise<boolean>;
}

export function CompactCard({
  className,
  image,
  deadlineLabel,
  dateLabel,
  timeLabel,
  title,
  locationIcon,
  locationText,
  isLiked = false,
  onLikeClick,
}: CompactCardProps) {
  return (
    <article
      className={cn(
        "group flex min-w-0 max-w-[30.2rem] flex-col items-start gap-3 transition-transform duration-300 ease-out hover:-translate-y-0.5 max-sm:inline-flex max-sm:w-full max-sm:gap-2",
        className,
      )}
    >
      <div className="relative aspect-162/114 w-full overflow-hidden rounded-[1.25rem] bg-slate-100 max-sm:rounded-[1rem]">
        {image}

        <div className="absolute right-3 bottom-3 max-sm:right-2.5 max-sm:bottom-2.5">
          <LikeButton isLiked={isLiked} onClick={onLikeClick} className="h-8 w-8 scale-90 sm:h-9 sm:w-9" />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-1.5 max-sm:flex-col max-sm:items-start max-sm:gap-1.5">
        {deadlineLabel ? (
          <Tag tone="blue" size="small" icon className="max-sm:hidden">
            {deadlineLabel}
          </Tag>
        ) : null}

        {dateLabel ? (
          <Tag tone="white" size="small" className="max-sm:hidden">
            {dateLabel}
          </Tag>
        ) : null}

        {timeLabel ? (
          <Tag tone="white" size="small" className="max-sm:hidden">
            {timeLabel}
          </Tag>
        ) : null}

        {deadlineLabel ? (
          <Tag tone="blue" size="small" icon className="hidden max-sm:inline-flex">
            {deadlineLabel}
          </Tag>
        ) : null}

        <div className="hidden items-center gap-1 max-sm:flex">
          {dateLabel ? (
            <Tag tone="white" size="small" className="inline-flex">
              {dateLabel}
            </Tag>
          ) : null}

          {timeLabel ? (
            <Tag tone="white" size="small" className="inline-flex">
              {timeLabel}
            </Tag>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1">
        <h3 className="line-clamp-2 font-semibold text-base text-black leading-[1.4] max-sm:text-sm">{title}</h3>

        <div className="flex items-center gap-1 font-medium text-slate-600 text-sm leading-[1.4] max-sm:text-xs">
          {locationIcon ? <span className="shrink-0">{locationIcon}</span> : null}
          <span className="line-clamp-1">{locationText}</span>
        </div>
      </div>
    </article>
  );
}
