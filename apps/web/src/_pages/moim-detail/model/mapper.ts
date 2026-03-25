import type { api } from "@/shared/api";
import type { InformationData, MeetingCategory, ParticipantData, PersonnelData, RecommendedMeetingData } from "./types";

type MeetingDetailResponse = Awaited<ReturnType<typeof api.meetings.getDetail>>["data"];

type MeetingsListResponse = Awaited<ReturnType<typeof api.meetings.getList>>["data"];

type MeetingListItemResponse = MeetingsListResponse["data"][number];

type ParticipantsListResponse = {
  data: {
    id: number;
    teamId: string;
    meetingId: number;
    userId: number;
    joinedAt: string | null;
    user?: {
      id: number;
      name: string;
      image: string | null;
    };
  }[];
  nextCursor: string | null;
  hasMore: boolean;
};

function formatMonthDay(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDeadlineLabel(value: string | null) {
  if (!value) {
    return "마감 정보 없음";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "마감 정보 없음";
  }

  const today = new Date();
  const isSameDay =
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  if (isSameDay) {
    return `오늘 ${formatTime(value)} 마감`;
  }

  return `${formatMonthDay(value)} ${formatTime(value)} 마감`;
}

function mapMeetingCategory(region: string, type: string): MeetingCategory {
  const normalizedRegion = region.toLowerCase().includes("online") || region.includes("온라인") ? "온라인" : "오프라인";

  const normalizedType = type.toLowerCase().includes("project") || type.includes("프로젝트") ? "프로젝트" : "스터디";

  return `${normalizedRegion} · ${normalizedType}` as MeetingCategory;
}

function getStatusLabel(params: {
  canceledAt: string | null;
  confirmedAt: string | null;
  participantCount: number;
  capacity: number;
}) {
  const { canceledAt, confirmedAt, participantCount, capacity } = params;

  if (canceledAt) {
    return "모집취소";
  }

  if (confirmedAt) {
    return "개설확정";
  }

  if (participantCount >= capacity) {
    return "모집마감";
  }

  return "모집중";
}

export function mapMeetingDetailToInformationData(meeting: MeetingDetailResponse): InformationData {
  return {
    id: meeting.id,
    title: meeting.name,
    category: mapMeetingCategory(meeting.region, meeting.type),
    deadlineLabel: formatDeadlineLabel(meeting.registrationEnd),
    dateLabel: formatMonthDay(meeting.dateTime),
    timeLabel: formatTime(meeting.dateTime),
    isLiked: false,
    image: meeting.image ?? null,
  };
}

export function mapMeetingDetailToDescription(meeting: MeetingDetailResponse) {
  return meeting.description ?? "";
}

export function mapMeetingDetailToPersonnelBaseData(
  meeting: MeetingDetailResponse,
): Omit<PersonnelData, "participants" | "extraCount"> {
  return {
    currentParticipants: meeting.participantCount,
    maxParticipants: meeting.capacity,
    statusLabel: getStatusLabel({
      canceledAt: meeting.canceledAt,
      confirmedAt: meeting.confirmedAt,
      participantCount: meeting.participantCount,
      capacity: meeting.capacity,
    }),
  };
}

export function mapParticipantsToParticipantData(participantsResponse: ParticipantsListResponse): ParticipantData[] {
  return participantsResponse.data.map((participant) => ({
    id: participant.user?.id ?? participant.userId,
    name: participant.user?.name ?? "알 수 없음",
    image: participant.user?.image ?? null,
  }));
}

export function mapMeetingToRecommendedMeetingData(meeting: MeetingListItemResponse): RecommendedMeetingData {
  return {
    id: meeting.id,
    title: meeting.name,
    locationText: mapMeetingCategory(meeting.region, meeting.type),
    deadlineLabel: formatDeadlineLabel(meeting.registrationEnd),
    dateLabel: formatMonthDay(meeting.dateTime),
    timeLabel: formatTime(meeting.dateTime),
    image: meeting.image ?? null,
    isLiked: false,
  };
}
