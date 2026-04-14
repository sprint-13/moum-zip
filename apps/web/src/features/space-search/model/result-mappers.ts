import type { SearchResultItem } from "@/entities/gathering";
import { getGatheringCategoryLabel } from "@/entities/gathering";

import { formatSearchDateChipLabel, formatSearchTimeChipLabel, getSearchDeadlineMeta } from "./result-formatters";
import type { SpaceCardItem } from "./types";

const FALLBACK_SPACE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" fill="none"><rect width="640" height="640" rx="48" fill="#F2F4F7"/><path d="M188 420V220H452V420H188Z" fill="#D0D5DD"/><circle cx="262" cy="276" r="36" fill="#98A2B3"/><path d="M224 388L306 306L368 368L410 326L452 388H224Z" fill="#98A2B3"/></svg>',
)}`;

export const mapSearchResultItemToSpaceCardItem = (item: SearchResultItem): SpaceCardItem => {
  const now = Date.now();
  const { deadlineLabel, isRegistClosed } = getSearchDeadlineMeta(item.registrationEnd, now);
  const statuses = [
    item.isJoined ? { label: "신청 완료" } : undefined,
    item.confirmedAt ? { label: "개설 확정" } : undefined,
  ].filter((status): status is NonNullable<typeof status> => status !== undefined);

  return {
    category: getGatheringCategoryLabel(item.type),
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
        label: formatSearchDateChipLabel(item.dateTime),
      },
      {
        id: "time",
        label: formatSearchTimeChipLabel(item.dateTime),
      },
    ],
    statuses: statuses.length > 0 ? statuses : undefined,
    title: item.title,
  };
};
