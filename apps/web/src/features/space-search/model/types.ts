import type { GatheringCategory } from "@/entities/gathering";

export type SearchCategoryId = "all" | GatheringCategory;
export type SearchFilterId = "date" | "location" | "deadline";
export type SearchDateSortId = "default" | "latest" | "oldest";
export type SearchLocationId = "all" | "online" | "offline";
export type SearchDeadlineSortId = "default" | "fast" | "slow";
export type SearchRequestCategoryId = "all" | "study" | "project";

export interface SearchCategory {
  id: SearchCategoryId;
  label: string;
}

export interface SearchFilterOption {
  id: string;
  label: string;
}

export interface SearchFilter {
  id: SearchFilterId;
  label: string;
  options: [SearchFilterOption, ...SearchFilterOption[]];
}

export interface SearchQueryState {
  categoryId: SearchCategoryId;
  dateSortId: SearchDateSortId;
  deadlineSortId: SearchDeadlineSortId;
  locationId: SearchLocationId;
}

export interface SearchRequestQueryState {
  categoryId: SearchRequestCategoryId;
  dateSortId: SearchDateSortId;
  deadlineSortId: SearchDeadlineSortId;
  locationId: SearchLocationId;
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
  categoryId: Exclude<SearchCategoryId, "all">;
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
  statuses?: SpaceCardStatus[];
  title: string;
}
