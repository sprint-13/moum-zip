import type { FavoriteWithMeeting, JoinedMeeting, MeetingWithHost, User } from "@moum-zip/api";
import type { MoimImageTone, MypageMoimCard, MypageProfile } from "./types";

const imageTones: MoimImageTone[] = ["beige", "daylight", "sunset", "city"];
type JoinedMeetingStatus = "scheduled" | "active" | "completed";

const getConfirmationBadge = (confirmedAt: string | null | undefined) => {
  return {
    label: confirmedAt ? "개설확정" : "개설대기",
    variant: confirmedAt ? "confirmed" : "waiting",
    withIcon: Boolean(confirmedAt),
  } as const;
};

export const formatMeetingDateTime = (dateTime: string | null) => {
  const meetingDate = new Date(dateTime ?? new Date().toISOString());

  return {
    date: new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    }).format(meetingDate),
    time: new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    }).format(meetingDate),
    isCompleted: meetingDate.getTime() < Date.now(),
  };
};

const getMeetingTimestamp = (dateTime: string | null) => {
  if (!dateTime) {
    return null;
  }

  const timestamp = new Date(dateTime).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const getJoinedMeetingStatus = (registrationEnd: string | null, dateTime: string | null): JoinedMeetingStatus => {
  const now = Date.now();
  const registrationEndTime = getMeetingTimestamp(registrationEnd);
  const meetingTime = getMeetingTimestamp(dateTime);

  if (meetingTime !== null && meetingTime <= now) {
    return "completed";
  }

  if (registrationEndTime !== null && registrationEndTime <= now) {
    return "active";
  }

  return "scheduled";
};

export const mapProfile = (user: User): MypageProfile => {
  return {
    name: user.name,
    email: user.email,
    imageUrl: user.image ?? undefined,
  };
};

export const mapJoinedMeeting = (meeting: JoinedMeeting, index: number, liked = false): MypageMoimCard => {
  const { date, time } = formatMeetingDateTime(meeting.dateTime);
  const status = getJoinedMeetingStatus(meeting.registrationEnd, meeting.dateTime);
  const isConfirmed = Boolean(meeting.confirmedAt);

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    imageUrl: meeting.image ?? undefined,
    liked,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: status === "active" && isConfirmed ? "primary" : "secondary",
    primaryBadge: {
      label: status === "scheduled" ? "참여 예정" : status === "active" ? "참여 중" : "참여 완료",
      variant: status === "completed" ? "completed" : "scheduled",
    },
    secondaryBadge: status === "completed" ? undefined : getConfirmationBadge(meeting.confirmedAt),
  };
};

export const mapCreatedMeeting = (meeting: MeetingWithHost, index: number, liked = false): MypageMoimCard => {
  const { date, time, isCompleted } = formatMeetingDateTime(meeting.dateTime);

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    imageUrl: meeting.image ?? undefined,
    liked,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: isCompleted ? "secondary" : "primary",
    primaryBadge: {
      label: isCompleted ? "진행 종료" : "진행 중",
      variant: isCompleted ? "completed" : "scheduled",
    },
    secondaryBadge: isCompleted ? undefined : getConfirmationBadge(meeting.confirmedAt),
  };
};

export const mapFavoriteMeeting = (favorite: FavoriteWithMeeting, index: number): MypageMoimCard => {
  const { meeting } = favorite;
  const { date, time } = formatMeetingDateTime(meeting.dateTime);
  const status = getJoinedMeetingStatus(meeting.registrationEnd, meeting.dateTime);
  const isConfirmed = Boolean(meeting.confirmedAt);

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    imageUrl: meeting.image ?? undefined,
    liked: true,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: status === "active" && isConfirmed ? "primary" : "secondary",
    primaryBadge: {
      label: status === "scheduled" ? "참여 예정" : status === "active" ? "참여 중" : "참여 완료",
      variant: status === "completed" ? "completed" : "scheduled",
    },
    secondaryBadge: status === "completed" ? undefined : getConfirmationBadge(meeting.confirmedAt),
  };
};
