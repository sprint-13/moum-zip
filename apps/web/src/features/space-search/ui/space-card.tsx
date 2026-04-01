import { CheckCircleIcon, LabeledProgressBar, Tag } from "@ui/components";
import Image from "next/image";
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

const MetaChip = ({ chip }: MetaChipProps) => {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border border-border bg-primary-foreground px-2 py-0.5 font-medium text-muted-foreground text-sm leading-5 xl:min-h-[1.375rem] xl:px-[0.4375rem] xl:py-[0.125rem] xl:text-[0.75rem] xl:leading-[1rem] 2xl:min-h-0 2xl:px-2 2xl:py-0.5 2xl:text-sm 2xl:leading-5">
      {chip.label}
    </span>
  );
};

const SpaceCardStatus = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center gap-0.5">
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
    imageAlt,
    imageSrc,
    isLiked = false,
    maxParticipants,
    metaChips,
    status,
    title,
    id: meetingId,
  } = item;

  return (
    <article className="flex flex-col gap-0 overflow-hidden rounded-[2rem] bg-card shadow-[0_20px_50px_rgba(17,17,17,0.04)] sm:gap-6 sm:overflow-visible sm:p-6 md:flex-row md:items-center xl:gap-5 xl:p-5 2xl:gap-6 2xl:p-6">
      <div className="relative w-full shrink-0 sm:w-full md:w-auto">
        <Image
          alt={imageAlt}
          className="h-39 w-full object-cover sm:h-50 sm:rounded-3xl md:size-42.5 xl:size-40 2xl:size-42.5"
          height={340}
          src={imageSrc}
          unoptimized
          width={340}
        />
        <div className="absolute top-4 right-4 sm:hidden">
          <SpaceCardLikeButton isAuthenticated={isAuthenticated} isLiked={isLiked} meetingId={item.id} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="truncate font-semibold text-foreground text-xl leading-normal tracking-[-0.04em]">
                {title}
              </h2>
              {status ? <SpaceCardStatus label={status.label} /> : null}
            </div>
            <p className="mt-1.5 inline-flex items-center gap-1 font-medium text-muted-foreground text-sm leading-5 tracking-[-0.02em]">
              <LocationPinIcon aria-hidden="true" className="size-4 shrink-0" />
              <span>{district}</span>
              <span aria-hidden="true">|</span>
              <span>{category}</span>
            </p>
          </div>

          <div className="hidden sm:block">
            <SpaceCardLikeButton isAuthenticated={isAuthenticated} isLiked={isLiked} meetingId={item.id} />
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 xl:gap-2.5 2xl:gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-4 xl:gap-3.5 2xl:gap-4">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {metaChips.map((chip) => (
                  <MetaChip chip={chip} key={chip.id} />
                ))}
              </div>
              <Tag
                size="small"
                className="shrink-0 xl:min-h-[1.375rem] xl:gap-[0.125rem] xl:py-[0.125rem] xl:pr-[0.4375rem] xl:pl-[0.3125rem] 2xl:min-h-0 2xl:gap-1 2xl:py-[0.2rem] 2xl:pr-[0.8rem] 2xl:pl-[0.4rem] xl:[&>span:last-child]:inline-flex xl:[&>span:last-child]:max-w-[6rem] xl:[&>span:last-child]:items-center xl:[&>span:last-child]:truncate xl:[&>span:last-child]:text-[0.75rem] xl:[&>span:last-child]:leading-[1rem] 2xl:[&>span:last-child]:max-w-none 2xl:[&>span:last-child]:overflow-visible 2xl:[&>span:last-child]:text-clip 2xl:[&>span:last-child]:text-xs 2xl:[&>span:last-child]:leading-4 xl:[&>svg]:size-[1.125rem] 2xl:[&>svg]:size-5"
                icon
              >
                {deadlineLabel}
              </Tag>
            </div>
            <LabeledProgressBar
              aria-label={`${title} 참여 현황`}
              className="mb-3.5 w-full max-w-64.5 sm:mb-0 xl:max-w-60 2xl:max-w-64.5"
              maxValue={maxParticipants}
              value={currentParticipants}
            />
          </div>

          <SpaceCardJoinButton
            className={cn(
              "h-12 min-w-26 shrink-0 rounded-xl border-[1.5px] px-6 font-semibold text-base leading-6 tracking-[-0.02em]",
              "xl:h-11 xl:min-w-24 xl:px-5 xl:text-sm 2xl:h-12 2xl:min-w-26 2xl:px-6 2xl:text-base",
              "w-auto",
            )}
            size="small"
            variant="secondary"
            isAuthenticated={isAuthenticated}
            meetingId={meetingId}
          >
            참여하기
          </SpaceCardJoinButton>
        </div>
      </div>
    </article>
  );
};
