import type { SearchResultItem } from "@/entities/gathering";

import { SPACE_SEARCH_CATEGORIES } from "./constants";
import type { SpaceCardItem } from "./types";

const FALLBACK_SPACE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" fill="none"><rect width="640" height="640" rx="48" fill="#F2F4F7"/><path d="M188 420V220H452V420H188Z" fill="#D0D5DD"/><circle cx="262" cy="276" r="36" fill="#98A2B3"/><path d="M224 388L306 306L368 368L410 326L452 388H224Z" fill="#98A2B3"/></svg>',
)}`;

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
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

const formatDeadlineLabel = (registrationEnd: string | null) => {
  if (!registrationEnd) {
    return "상시 모집";
  }

  const deadlineTime = new Date(registrationEnd).getTime();
  const remainingTime = deadlineTime - Date.now();

  if (remainingTime <= 0) {
    return "마감";
  }

  const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

  if (remainingDays <= 1) {
    return "오늘 마감";
  }

  return `${remainingDays}일 후 마감`;
};

export const mapSearchResultItemToSpaceCardItem = (item: SearchResultItem): SpaceCardItem => {
  return {
    category: categoryLabelById[item.type] ?? item.type,
    categoryId: item.type,
    currentParticipants: item.participantCount,
    deadlineLabel: formatDeadlineLabel(item.registrationEnd),
    district: item.location,
    id: item.id,
    imageAlt: `${item.title} thumbnail`,
    imageSrc: item.image ?? FALLBACK_SPACE_IMAGE,
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
