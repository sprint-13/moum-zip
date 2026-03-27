import type { FavoriteWithMeeting, User, UserMeeting } from "@moum-zip/api";
import type { MoimImageTone, MypageMoimCard, MypageProfile } from "./types";

const imageTones: MoimImageTone[] = ["beige", "daylight", "sunset", "city"];

export function formatMeetingDateTime(dateTime: string) {
  const meetingDate = new Date(dateTime);

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
}

export function mapProfile(user: User): MypageProfile {
  return {
    name: user.name,
    email: user.email,
    imageUrl: user.image ?? undefined,
  };
}

export function mapJoinedMeeting(meeting: UserMeeting, index: number, liked = false): MypageMoimCard {
  const { date, time, isCompleted } = formatMeetingDateTime(meeting.dateTime);

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    liked,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: isCompleted ? "secondary" : "primary",
    primaryBadge: {
      label: isCompleted ? "참여 완료" : "참여 예정",
      variant: isCompleted ? "completed" : "scheduled",
    },
  };
}

export function mapCreatedMeeting(meeting: UserMeeting, index: number, liked = false): MypageMoimCard {
  const { date, time, isCompleted } = formatMeetingDateTime(meeting.dateTime);

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    liked,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: isCompleted ? "secondary" : "primary",
    primaryBadge: {
      label: isCompleted ? "진행 종료" : "진행 중",
      variant: isCompleted ? "completed" : "scheduled",
    },
  };
}

export function mapFavoriteMeeting(favorite: FavoriteWithMeeting, index: number): MypageMoimCard {
  const { meeting } = favorite;
  const { date, time, isCompleted } = formatMeetingDateTime(meeting.dateTime ?? new Date().toISOString());

  return {
    id: String(meeting.id),
    title: meeting.name,
    participantCount: `${meeting.participantCount}/${meeting.capacity}`,
    location: meeting.region,
    date,
    time,
    liked: true,
    imageTone: imageTones[index % imageTones.length],
    actionLabel: "스페이스 입장",
    actionVariant: isCompleted ? "secondary" : "primary",
    primaryBadge: {
      label: isCompleted ? "참여 완료" : "참여 예정",
      variant: isCompleted ? "completed" : "scheduled",
    },
    secondaryBadge: {
      label: meeting.confirmedAt ? "개설확정" : "개설대기",
      variant: meeting.confirmedAt ? "confirmed" : "waiting",
      withIcon: Boolean(meeting.confirmedAt),
    },
  };
}
