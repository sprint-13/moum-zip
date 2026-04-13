import { CheckCircleIcon, LabeledProgressBar, Tag } from "@ui/components";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

import LocationPinIcon from "../assets/location-pin.svg";
import type { SpaceCardItem, SpaceCardMetaChip } from "../model/types";
import { SpaceCardJoinButton } from "./space-card-join-button";
import { SpaceCardLikeButton } from "./space-card-like-button";

interface SpaceCardProps {
  isAuthenticated: boolean;
  item: SpaceCardItem;
}

interface MetaChipProps {
  chip: SpaceCardMetaChip;
}

const truncateTitle = (title: string, maxLength = 30) => {
  if (title.length <= maxLength) {
    return title;
  }

  return `${title.slice(0, maxLength)}...`;
};

const deadlineTagClassName = cn(
  "shrink-0",
  "lg:min-h-[1.375rem] lg:gap-[0.125rem] lg:py-[0.125rem] lg:pr-[0.4375rem] lg:pl-[0.3125rem]",
  "2xl:min-h-0 2xl:gap-1 2xl:py-[0.2rem] 2xl:pr-[0.8rem] 2xl:pl-[0.4rem]",
  "lg:[&>span:last-child]:inline-flex lg:[&>span:last-child]:max-w-[6rem] lg:[&>span:last-child]:items-center lg:[&>span:last-child]:truncate lg:[&>span:last-child]:text-[0.75rem] lg:[&>span:last-child]:leading-[1rem]",
  "2xl:[&>span:last-child]:max-w-none 2xl:[&>span:last-child]:overflow-visible 2xl:[&>span:last-child]:text-clip 2xl:[&>span:last-child]:text-xs 2xl:[&>span:last-child]:leading-4",
  "lg:[&>svg]:size-[1.125rem] 2xl:[&>svg]:size-5",
);
const cardWrapperClassName = "group/card -m-1 rounded-[2.25rem] p-1";
const cardClassName =
  "relative flex w-full min-w-0 flex-col gap-0 overflow-hidden rounded-[2rem] bg-card shadow-[0_10px_24px_rgba(17,17,17,0.09)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none sm:gap-6 sm:overflow-visible sm:p-6 md:flex-row md:items-center lg:gap-5 lg:p-5 lg:group-hover/card:-translate-y-0.5 lg:group-hover/card:shadow-[0_16px_32px_rgba(17,17,17,0.14)] motion-reduce:lg:group-hover/card:translate-y-0 2xl:gap-6 2xl:p-6";
const cardImageClassName =
  "h-39 w-full object-cover transition-transform duration-300 ease-out motion-reduce:transition-none sm:h-50 sm:rounded-3xl md:size-42.5 lg:size-40 lg:group-hover/card:scale-[1.015] motion-reduce:lg:group-hover/card:scale-100 2xl:size-42.5";
const cardTitleClassName =
  "min-w-0 flex-1 truncate font-semibold text-foreground text-xl leading-normal tracking-[-0.04em] transition-colors duration-300 motion-reduce:transition-none";

const MetaChip = ({ chip }: MetaChipProps) => {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border border-border bg-primary-foreground px-2 py-0.5 font-medium text-muted-foreground text-sm leading-5 lg:min-h-[1.375rem] lg:px-[0.4375rem] lg:py-[0.125rem] lg:text-[0.75rem] lg:leading-[1rem] 2xl:min-h-0 2xl:px-2 2xl:py-0.5 2xl:text-sm 2xl:leading-5">
      {chip.label}
    </span>
  );
};

const SpaceCardStatus = ({ className, label }: { className?: string; label: string }) => {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <CheckCircleIcon />
      <span className="font-medium text-primary text-sm leading-5">{label}</span>
    </span>
  );
};

export const SpaceCard = ({ isAuthenticated, item }: SpaceCardProps) => {
  const {
    category,
    currentParticipants,
    deadlineLabel,
    district,
    id: meetingId,
    imageAlt,
    imageSrc,
    isLiked = false,
    isRegistClosed,
    maxParticipants,
    metaChips,
    statuses,
    title,
  } = item;
  const displayTitle = truncateTitle(title);
  const detailHref = `${ROUTES.moimDetail}/${meetingId}`;

  const joinButtonClassName = cn(
    "h-12 min-w-26 shrink-0 whitespace-nowrap px-6 text-base leading-6 tracking-[-0.02em] lg:h-11 lg:min-w-24 lg:px-5 lg:text-sm 2xl:h-12 2xl:min-w-26 2xl:px-6 2xl:text-base",
    {
      "border-[0.09375rem]": !isRegistClosed,
      "cursor-not-allowed opacity-60 active:scale-100": isRegistClosed,
    },
  );
  const likeButtonProps = { isAuthenticated, isLiked, meetingId };

  return (
    <div className={cardWrapperClassName}>
      <article
        className={cn(
          cardClassName,
          isRegistClosed &&
            "bg-card/90 opacity-90 shadow-[0_8px_18px_rgba(17,17,17,0.07)] lg:group-hover/card:translate-y-0 lg:group-hover/card:shadow-[0_10px_24px_rgba(17,17,17,0.09)]",
        )}
      >
        <Link
          aria-label={`${title} 상세 페이지 보기`}
          className="absolute inset-0 z-10 rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          href={detailHref}
          prefetch={false}
        />
        <div className="relative w-full shrink-0 sm:w-full md:w-auto">
          <Image
            alt={imageAlt}
            className={cn(cardImageClassName, isRegistClosed && "saturate-50 lg:group-hover/card:scale-100")}
            height={340}
            src={imageSrc}
            unoptimized
            width={340}
          />
          <div className="absolute top-4 right-4 z-20 sm:hidden">
            <SpaceCardLikeButton {...likeButtonProps} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h2
                  className={cn(cardTitleClassName, !isRegistClosed && "lg:group-hover/card:text-primary")}
                  title={title}
                >
                  {displayTitle}
                </h2>
                {statuses?.map((status) => (
                  <SpaceCardStatus className="shrink-0" key={status.label} label={status.label} />
                ))}
              </div>
              <p className="mt-1.5 inline-flex items-center gap-1 font-medium text-muted-foreground text-sm leading-5 tracking-[-0.02em]">
                <LocationPinIcon aria-hidden="true" className="size-4 shrink-0" />
                <span>{district}</span>
                <span aria-hidden="true">|</span>
                <span>{category}</span>
              </p>
            </div>

            <div className="relative z-20 hidden sm:block">
              <SpaceCardLikeButton {...likeButtonProps} />
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 lg:gap-2.5 2xl:gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-4 lg:gap-3.5 2xl:gap-4">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {metaChips.map((chip) => (
                    <MetaChip chip={chip} key={chip.id} />
                  ))}
                </div>
                <Tag size="small" className={deadlineTagClassName} icon>
                  {deadlineLabel}
                </Tag>
              </div>
              <LabeledProgressBar
                aria-label={`${title} 참여 현황`}
                className="mb-3.5 w-full max-w-64.5 sm:mb-0 lg:max-w-60 2xl:max-w-64.5"
                maxValue={maxParticipants}
                value={currentParticipants}
              />
            </div>

            <SpaceCardJoinButton
              className={joinButtonClassName}
              disabled={isRegistClosed}
              size="small"
              variant={isRegistClosed ? "primary" : "secondary"}
            >
              {isRegistClosed ? "모집 마감" : "참여하기"}
            </SpaceCardJoinButton>
          </div>
        </div>
      </article>
    </div>
  );
};
