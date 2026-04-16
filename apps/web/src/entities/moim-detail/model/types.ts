export type MeetingCategory = "온라인 · 스터디" | "온라인 · 프로젝트" | "오프라인 · 스터디" | "오프라인 · 프로젝트";

export type MeetingRegion = "online" | "offline";
export type MeetingType = "study" | "project";

export type ViewerRole = "guest" | "member" | "manager";

export type MeetingStatus = "recruiting" | "confirmed" | "full" | "canceled";

export interface MeetingActionState {
  canFavorite: boolean;
  canJoin: boolean;
  canCancelJoin: boolean;
  canEdit: boolean;
  canDelete: boolean;
  requiresAuth: boolean;
}

export interface InformationData {
  id: number;
  teamId: string;
  title: string;
  category: MeetingCategory;
  deadlineLabel: string;
  dateLabel: string;
  timeLabel: string;
  isLiked: boolean;
  image: string | null;
  hostId: number;
  hostName: string;
  hostImage: string | null;
  viewerRole: ViewerRole;
  isJoined: boolean;
  status: MeetingStatus;
  statusLabel: string;
  actionState: MeetingActionState;
}

export interface ParticipantData {
  id: number;
  name: string;
  image: string | null;
}

export interface PersonnelData {
  currentParticipants: number;
  maxParticipants: number;
  statusLabel: string;
  participants: ParticipantData[];
  extraCount: number;
}

export interface RecommendedMeetingData {
  id: number;
  teamId: string;
  title: string;
  locationText: MeetingCategory;
  deadlineLabel: string;
  dateLabel: string;
  timeLabel: string;
  image: string | null;
  isLiked: boolean;
}

export interface MoimDetailViewData {
  information: InformationData;
  description: string;
  personnel: PersonnelData;
  recommendedMeetings: RecommendedMeetingData[];
}

export interface MeetingFormData {
  title: string;
  location: MeetingRegion;
  category: MeetingType;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  image: string | null;
  description: string;
}
