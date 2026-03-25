export type MeetingCategory = "온라인 · 스터디" | "온라인 · 프로젝트" | "오프라인 · 스터디" | "오프라인 · 프로젝트";

export interface InformationData {
  id: number;
  title: string;
  category: MeetingCategory;
  deadlineLabel: string;
  dateLabel: string;
  timeLabel: string;
  isLiked: boolean;
  image: string | null;
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
