export type SpaceSearchCategoryId = "all" | "hobby" | "study" | "project" | "business" | "health" | "family" | "etc";
export type SpaceSearchFilterId = "date" | "location" | "deadline";
export type SpaceSearchDateSortId = "default" | "latest" | "oldest";
export type SpaceSearchLocationId = "all" | "online" | "offline";
export type SpaceSearchDeadlineSortId = "default" | "fast" | "slow";

export interface SpaceSearchCategory {
  id: SpaceSearchCategoryId;
  label: string;
}

export interface SpaceSearchFilterOption {
  id: string;
  label: string;
}

export interface SpaceSearchFilter {
  id: SpaceSearchFilterId;
  label: string;
  options: [SpaceSearchFilterOption, ...SpaceSearchFilterOption[]];
}

export interface SpaceSearchQueryState {
  categoryId: SpaceSearchCategoryId;
  dateSortId: SpaceSearchDateSortId;
  deadlineSortId: SpaceSearchDeadlineSortId;
  locationId: SpaceSearchLocationId;
}

export interface SpaceCardMetaChip {
  id: string;
  label: string;
}

export interface SpaceCardStatus {
  label: string;
}

export interface SpaceCardItem {
  category: string;
  categoryId: Exclude<SpaceSearchCategoryId, "all">;
  currentParticipants: number;
  deadlineLabel: string;
  district: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  isRegistClosed: boolean;
  isLiked?: boolean;
  maxParticipants: number;
  metaChips: SpaceCardMetaChip[];
  status?: SpaceCardStatus;
  title: string;
}
