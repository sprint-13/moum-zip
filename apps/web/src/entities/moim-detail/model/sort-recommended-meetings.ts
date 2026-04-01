interface RecommendedMeetingBase {
  id: number;
  type?: string | null;
  hostId?: number | null;
  registrationEnd?: string | null;
  participantCount?: number | null;
}

interface CurrentMeetingBase {
  id: number;
  type?: string | null;
  hostId?: number | null;
}

function getDeadlineTime(date?: string | null) {
  return date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER;
}

export function sortRecommendedMeetings<T extends RecommendedMeetingBase>(
  meetings: T[],
  currentMeeting: CurrentMeetingBase,
) {
  return [...meetings]
    .filter((meeting) => meeting.id !== currentMeeting.id)
    .sort((a, b) => {
      const aSameType = a.type === currentMeeting.type ? 1 : 0;
      const bSameType = b.type === currentMeeting.type ? 1 : 0;

      if (aSameType !== bSameType) {
        return bSameType - aSameType;
      }

      const aSameHost = a.hostId === currentMeeting.hostId ? 1 : 0;
      const bSameHost = b.hostId === currentMeeting.hostId ? 1 : 0;

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
    .slice(0, 4);
}
