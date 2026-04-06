interface MeetingBase {
  id: number;
  type?: string | null;
  region?: string | null;
  hostId?: number | null;
}

interface RecommendedMeetingBase extends MeetingBase {
  registrationEnd?: string | null;
  participantCount?: number | null;
}

interface CurrentMeetingBase extends MeetingBase {}

const RECOMMEND_LIMIT = 4;

const MATCH_PRIORITY = {
  BOTH: 4,
  TYPE_ONLY: 3,
  REGION_ONLY: 2,
  NONE: 1,
} as const;

const getDeadlineTime = (date?: string | null) => {
  return date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER;
};

const normalizeType = (type?: string | null) => {
  if (!type) {
    return "";
  }

  const normalized = type.trim().toLowerCase();

  if (normalized === "project" || normalized === "프로젝트") {
    return "project";
  }

  if (normalized === "study" || normalized === "스터디") {
    return "study";
  }

  return normalized;
};

const normalizeRegion = (region?: string | null) => {
  if (!region) {
    return "";
  }

  const normalized = region.trim().toLowerCase();

  if (normalized === "online" || normalized === "온라인") {
    return "online";
  }

  if (normalized === "offline" || normalized === "오프라인") {
    return "offline";
  }

  return normalized;
};

const getMatchPriority = (meeting: RecommendedMeetingBase, currentMeeting: CurrentMeetingBase) => {
  const meetingType = normalizeType(meeting.type);
  const currentType = normalizeType(currentMeeting.type);

  const meetingRegion = normalizeRegion(meeting.region);
  const currentRegion = normalizeRegion(currentMeeting.region);

  const isSameType = meetingType !== "" && meetingType === currentType;
  const isSameRegion = meetingRegion !== "" && meetingRegion === currentRegion;

  if (isSameType && isSameRegion) {
    return MATCH_PRIORITY.BOTH;
  }

  if (isSameType) {
    return MATCH_PRIORITY.TYPE_ONLY;
  }

  if (isSameRegion) {
    return MATCH_PRIORITY.REGION_ONLY;
  }

  return MATCH_PRIORITY.NONE;
};

export const sortRecommendedMeetings = <T extends RecommendedMeetingBase>(
  meetings: T[],
  currentMeeting: CurrentMeetingBase,
) => {
  return [...meetings]
    .filter((meeting) => meeting.id !== currentMeeting.id)
    .sort((a, b) => {
      const aPriority = getMatchPriority(a, currentMeeting);
      const bPriority = getMatchPriority(b, currentMeeting);

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      const aSameHost = a.hostId != null && currentMeeting.hostId != null && a.hostId === currentMeeting.hostId ? 1 : 0;
      const bSameHost = b.hostId != null && currentMeeting.hostId != null && b.hostId === currentMeeting.hostId ? 1 : 0;

      if (aSameHost !== bSameHost) {
        return bSameHost - aSameHost;
      }

      const aDeadline = getDeadlineTime(a.registrationEnd);
      const bDeadline = getDeadlineTime(b.registrationEnd);

      if (aDeadline !== bDeadline) {
        return aDeadline - bDeadline;
      }

      return (b.participantCount ?? 0) - (a.participantCount ?? 0);
    })
    .slice(0, RECOMMEND_LIMIT);
};
