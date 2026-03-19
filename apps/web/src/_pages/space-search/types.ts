export interface SpaceSearchNavItem {
  href: string;
  id: string;
  isActive?: boolean;
  label: string;
  notificationCount?: number;
}

export type SpaceSearchCategoryId = string;
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

export interface SpaceSearchMetaChip {
  id: string;
  label: string;
}

export interface SpaceSearchStatus {
  label: string;
}

export interface SpaceSearchCardItem {
  category: string;
  currentParticipants: number;
  deadlineLabel: string;
  district: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  isLiked?: boolean;
  maxParticipants: number;
  metaChips: SpaceSearchMetaChip[];
  status?: SpaceSearchStatus;
  title: string;
}

export interface SpaceSearchResultPage {
  items: SpaceSearchCardItem[];
  pagination: SpaceSearchPagination;
}
