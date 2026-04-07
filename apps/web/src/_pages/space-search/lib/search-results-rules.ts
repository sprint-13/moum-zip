import type { GatheringCategory, GatheringLocation } from "@/entities/gathering";
import { normalizeGatheringCategory } from "@/entities/gathering";

type SearchSortBy = "dateTime" | "registrationEnd";
type SearchSortOrder = "asc" | "desc";

interface ResolveSortParamsInput {
  dateSortId?: "default" | "latest" | "oldest";
  deadlineSortId?: "default" | "fast" | "slow";
}

export const normalizeMeetingType = (type: string): GatheringCategory | null => {
  return normalizeGatheringCategory(type);
};

export const normalizeMeetingRegion = (region: string | null | undefined): GatheringLocation => {
  if (typeof region !== "string") {
    return "offline";
  }

  const normalizedRegion = region.trim().toLowerCase();

  if (normalizedRegion === "online") {
    return "online";
  }

  if (normalizedRegion === "offline") {
    return "offline";
  }

  return "offline";
};

export const resolveSortParams = ({
  dateSortId,
  deadlineSortId,
}: ResolveSortParamsInput): {
  sortBy?: SearchSortBy;
  sortOrder?: SearchSortOrder;
} => {
  if (deadlineSortId === "fast") {
    return {
      sortBy: "registrationEnd",
      sortOrder: "asc",
    };
  }

  if (deadlineSortId === "slow") {
    return {
      sortBy: "registrationEnd",
      sortOrder: "desc",
    };
  }

  if (dateSortId === "latest") {
    return {
      sortBy: "dateTime",
      sortOrder: "desc",
    };
  }

  if (dateSortId === "oldest") {
    return {
      sortBy: "dateTime",
      sortOrder: "asc",
    };
  }

  return {};
};
