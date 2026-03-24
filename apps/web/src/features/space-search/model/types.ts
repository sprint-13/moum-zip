export type SpaceSearchCategoryId = "all" | "hobby" | "study" | "business" | "health" | "family" | "etc";
export type SpaceSearchFilterId = "date" | "district" | "deadline";

export interface SpaceSearchCategory {
  id: SpaceSearchCategoryId;
  label: string;
}

export interface SpaceSearchFilter {
  hasLeftIcon?: boolean;
  id: SpaceSearchFilterId;
  label: string;
}

export interface SpaceSearchQueryState {
  categoryId: SpaceSearchCategoryId;
  page: number;
}

export interface SpaceSearchPagination {
  currentPage: number;
  totalPages: number;
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
  isLiked?: boolean;
  maxParticipants: number;
  metaChips: SpaceCardMetaChip[];
  status?: SpaceCardStatus;
  title: string;
}

export interface SpaceSearchResultPage {
  items: SpaceCardItem[];
  pagination: SpaceSearchPagination;
}
