export type SpaceType = "study" | "project";
export type SpaceLocation = "online" | "offline";
//TODO: 추후 entities로 옮기는 것 고려
export interface SpaceHost {
  id: number;
  name: string;
  image: string | null;
}

export interface SpaceList {
  id: number;
  teamId: string;
  name: string;
  type: SpaceType;
  region: string | null;
  address: string | null;
  location: SpaceLocation;
  dateTime: string | null;
  registrationEnd: string | null;
  capacity: number;
  participantCount: number;
  image: string | null;
  description: string | null;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string | null;
  updatedAt: string | null;
  host: SpaceHost;
}

export interface GetSpaceListResponse {
  data: SpaceList[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FavoriteSpace {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string | null;
  meeting: SpaceList;
}

export interface GetFavoriteSpaceListResponse {
  data: FavoriteSpace[];
  nextCursor: string | null;
  hasMore: boolean;
}
