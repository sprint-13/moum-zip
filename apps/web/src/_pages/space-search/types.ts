export interface SpaceSearchNavItem {
  href: string;
  id: string;
  isActive?: boolean;
  label: string;
  notificationCount?: number;
}

export interface SpaceSearchCategory {
  id: string;
  isActive?: boolean;
  label: string;
}

export interface SpaceSearchFilter {
  hasLeftIcon?: boolean;
  id: string;
  isSelected?: boolean;
  label: string;
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
