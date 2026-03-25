import type { InferSelectModel } from "drizzle-orm";

import type { spaces } from "@/shared/db/scheme";

export type GatheringCategory = "study" | "project";
export type GatheringLocation = "online" | "offline";

export type SpaceRow = InferSelectModel<typeof spaces>;

export interface SearchResultItem {
  address: string | null;
  capacity: number;
  confirmedAt: string | null;
  dateTime: string | null;
  description: string | null;
  id: string;
  image: string | null;
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
