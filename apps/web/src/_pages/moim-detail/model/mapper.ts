import type { api } from "@/shared/api";
import type {
  InformationData,
  MeetingActionState,
  MeetingCategory,
  MeetingFormData,
  MeetingRegion,
  MeetingStatus,
  MeetingType,
  ParticipantData,
  PersonnelData,
  RecommendedMeetingData,
  ViewerRole,
} from "./types";

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

const KST_TIME_ZONE = "Asia/Seoul";

function getDatePartsInKst(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = formatter.formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
}

function isSameDayInKst(a: string | Date, b: string | Date) {
  const aParts = getDatePartsInKst(a);
  const bParts = getDatePartsInKst(b);

  if (!aParts || !bParts) {
    return false;
  }

  return aParts.year === bParts.year && aParts.month === bParts.month && aParts.day === bParts.day;
}

function formatMonthDay(value: string | null) {
  if (!value) {
    return "-";
  }

  const parts = getDatePartsInKst(value);

  if (!parts) {
    return "-";
  }

  return `${parts.month}월 ${parts.day}일`;
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
    timeZone: KST_TIME_ZONE,
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

  if (isSameDayInKst(new Date(), date)) {
    return `오늘 ${formatTime(value)} 마감`;
  }

  return `${formatMonthDay(value)} ${formatTime(value)} 마감`;
}

function normalizeRegion(region: string): MeetingRegion {
  const normalized = region.trim().toLowerCase();

  if (normalized === "online" || normalized === "온라인") {
    return "online";
  }

  return "offline";
}

function normalizeType(type: string): MeetingType {
  const normalized = type.trim().toLowerCase();

  if (normalized === "project" || normalized === "프로젝트") {
    return "project";
  }

  return "study";
}

export function mapMeetingCategory(region: MeetingRegion | string, type: MeetingType | string): MeetingCategory {
  const normalizedRegion = typeof region === "string" ? normalizeRegion(region) : region;
  const normalizedType = typeof type === "string" ? normalizeType(type) : type;

  const regionLabel = normalizedRegion === "online" ? "온라인" : "오프라인";
  const typeLabel = normalizedType === "project" ? "프로젝트" : "스터디";

  return `${regionLabel} · ${typeLabel}` as MeetingCategory;
}

function getMeetingStatus(params: {
  canceledAt: string | null;
  confirmedAt: string | null;
  participantCount: number;
  capacity: number;
}): MeetingStatus {
  const { canceledAt, confirmedAt, participantCount, capacity } = params;

  if (canceledAt) {
    return "canceled";
  }

  if (participantCount >= capacity) {
    return "full";
  }

  if (confirmedAt) {
    return "confirmed";
  }

  return "recruiting";
}

function getStatusLabel(status: MeetingStatus) {
  switch (status) {
    case "canceled":
      return "모집취소";
    case "confirmed":
      return "개설확정";
    case "full":
      return "모집마감";
    case "recruiting":
    default:
      return "모집중";
  }
}

function getViewerRole(currentUserId: number | null, hostId: number): ViewerRole {
  if (!currentUserId) {
    return "guest";
  }

  if (currentUserId === hostId) {
    return "manager";
  }

  return "member";
}

export function getIsJoined(participantsResponse: ParticipantsListResponse, currentUserId: number | null) {
  if (!currentUserId) {
    return false;
  }

  return participantsResponse.data.some((participant) => participant.userId === currentUserId);
}

function getIsLiked<T>(meeting: T) {
  return (meeting as T & { isFavorited?: boolean | null }).isFavorited ?? false;
}

function getMeetingActionState(params: {
  viewerRole: ViewerRole;
  isJoined: boolean;
  status: MeetingStatus;
}): MeetingActionState {
  const { viewerRole, isJoined, status } = params;

  const isGuest = viewerRole === "guest";
  const isManager = viewerRole === "manager";
  const isMember = viewerRole === "member";
  const canJoinStatus = status === "recruiting" || status === "confirmed";

  return {
    canFavorite: !isManager,
    canJoin: isMember && !isJoined && canJoinStatus,
    canCancelJoin: isMember && isJoined,
    canEdit: isManager,
    canDelete: isManager,
    requiresAuth: isGuest,
  };
}

export function mapMeetingDetailToInformationData(params: {
  meeting: MeetingDetailResponse;
  currentUserId: number | null;
  isJoined: boolean;
}): InformationData {
  const { meeting, currentUserId, isJoined } = params;

  const viewerRole = getViewerRole(currentUserId, meeting.hostId);
  const status = getMeetingStatus({
    canceledAt: meeting.canceledAt,
    confirmedAt: meeting.confirmedAt,
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
  });

  return {
    id: meeting.id,
    teamId: meeting.teamId,
    title: meeting.name,
    category: mapMeetingCategory(meeting.region, meeting.type),
    deadlineLabel: formatDeadlineLabel(meeting.registrationEnd),
    dateLabel: formatMonthDay(meeting.dateTime),
    timeLabel: formatTime(meeting.dateTime),
    isLiked: getIsLiked(meeting),
    image: meeting.image ?? null,
    hostId: meeting.hostId,
    viewerRole,
    isJoined,
    status,
    statusLabel: getStatusLabel(status),
    actionState: getMeetingActionState({
      viewerRole,
      isJoined,
      status,
    }),
  };
}

export function mapMeetingDetailToDescription(meeting: MeetingDetailResponse) {
  return meeting.description ?? "";
}

export function mapMeetingDetailToPersonnelBaseData(
  meeting: MeetingDetailResponse,
): Omit<PersonnelData, "participants" | "extraCount"> {
  const status = getMeetingStatus({
    canceledAt: meeting.canceledAt,
    confirmedAt: meeting.confirmedAt,
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
  });

  return {
    currentParticipants: meeting.participantCount,
    maxParticipants: meeting.capacity,
    statusLabel: getStatusLabel(status),
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
    teamId: meeting.teamId,
    title: meeting.name,
    locationText: mapMeetingCategory(meeting.region, meeting.type),
    deadlineLabel: formatDeadlineLabel(meeting.registrationEnd),
    dateLabel: formatMonthDay(meeting.dateTime),
    timeLabel: formatTime(meeting.dateTime),
    image: meeting.image ?? null,
    isLiked: getIsLiked(meeting),
  };
}

export function mapMeetingFormDataToRequest(formData: MeetingFormData) {
  return {
    name: formData.title,
    region: formData.location,
    type: formData.category,
    dateTime: formData.dateTime,
    registrationEnd: formData.registrationEnd,
    capacity: formData.capacity,
    image: formData.image,
    description: formData.description,
  };
}
