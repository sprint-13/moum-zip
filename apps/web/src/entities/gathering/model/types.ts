import type { GatheringCategoryId } from "./category-contract";

export type GatheringCategory = GatheringCategoryId;
export type GatheringLocation = "online" | "offline";

export interface SearchResultItem {
  address: string | null;
  capacity: number;
  confirmedAt: string | null;
  dateTime: string | null;
  description: string | null;
  id: string;
  image: string | null;
  isJoined?: boolean;
  isLiked: boolean;
  location: GatheringLocation;
  participantCount: number;
  region: string;
  registrationEnd: string | null;
  slug: string;
  title: string;
  type: GatheringCategory;
}

export interface SearchResultsResponse {
  hasMore: boolean;
  items: SearchResultItem[];
  nextCursor: string | null;
}
