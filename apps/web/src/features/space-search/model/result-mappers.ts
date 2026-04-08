import type { SearchResultItem } from "@/entities/gathering";

import { SPACE_SEARCH_CATEGORIES } from "./constants";
import type { SpaceCardItem } from "./types";

const FALLBACK_SPACE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" fill="none"><rect width="640" height="640" rx="48" fill="#F2F4F7"/><path d="M188 420V220H452V420H188Z" fill="#D0D5DD"/><circle cx="262" cy="276" r="36" fill="#98A2B3"/><path d="M224 388L306 306L368 368L410 326L452 388H224Z" fill="#98A2B3"/></svg>',
)}`;

const KST_TIME_ZONE = "Asia/Seoul";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
  timeZone: KST_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  timeZone: KST_TIME_ZONE,
});

const kstDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
  timeZone: KST_TIME_ZONE,
  year: "numeric",
});

const categoryLabelById = Object.fromEntries(
  SPACE_SEARCH_CATEGORIES.filter(({ id }) => id !== "all").map(({ id, label }) => [id, label]),
) as Record<string, string>;

const formatChipLabel = (dateTime: string | null, formatter: Intl.DateTimeFormat, fallbackLabel: string) => {
  if (!dateTime) {
    return fallbackLabel;
  }

  return formatter.format(new Date(dateTime));
};

const toDeadlineTime = (registrationEnd: string | null) => {
  if (!registrationEnd) {
    return null;
  }

  const deadlineTime = Date.parse(registrationEnd);

  if (Number.isNaN(deadlineTime)) {
    return null;
  }

  return deadlineTime;
};

const isSameDayInKst = (a: number, b: number) => {
  return kstDateFormatter.format(new Date(a)) === kstDateFormatter.format(new Date(b));
};

const getDeadlineMeta = (registrationEnd: string | null, now: number) => {
  const deadlineTime = toDeadlineTime(registrationEnd);

  if (deadlineTime === null) {
    return {
      deadlineLabel: "상시 모집",
      isRegistClosed: false,
    };
  }

  const remainingTime = deadlineTime - now;

  if (remainingTime <= 0) {
    return {
      deadlineLabel: "마감",
      isRegistClosed: true,
    };
  }

  if (isSameDayInKst(now, deadlineTime)) {
    return {
      deadlineLabel: `오늘 ${timeFormatter.format(new Date(deadlineTime))} 마감`,
      isRegistClosed: false,
    };
  }

  const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

  return {
    deadlineLabel: `${remainingDays}일 후 마감`,
    isRegistClosed: false,
  };
};

export const mapSearchResultItemToSpaceCardItem = (item: SearchResultItem): SpaceCardItem => {
  const now = Date.now();
  const { deadlineLabel, isRegistClosed } = getDeadlineMeta(item.registrationEnd, now);

  return {
    category: categoryLabelById[item.type] ?? item.type,
    categoryId: item.type,
    currentParticipants: item.participantCount,
    deadlineLabel,
    district: item.location,
    id: item.id,
    imageAlt: `${item.title} thumbnail`,
    imageSrc: item.image ?? FALLBACK_SPACE_IMAGE,
    isRegistClosed,
    isLiked: item.isLiked,
    maxParticipants: item.capacity,
    metaChips: [
      {
        id: "date",
        label: formatChipLabel(item.dateTime, dateFormatter, "일정 미정"),
      },
      {
        id: "time",
        label: formatChipLabel(item.dateTime, timeFormatter, "시간 미정"),
      },
    ],
    status: item.confirmedAt ? { label: "개설 확정" } : undefined,
    title: item.title,
  };
};
