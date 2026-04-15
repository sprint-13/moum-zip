import type { Metadata } from "next";
import { api } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";
import { DEFAULT_SITE_DESCRIPTION } from "@/shared/config/site";

type MeetingDetailResponse = Awaited<ReturnType<typeof api.meetings.getDetail>>;
type MeetingDetailData = MeetingDetailResponse["data"];

const MOIM_DETAIL_FALLBACK_TITLE = "모임 상세";
const DESCRIPTION_MAX_LENGTH = 160;

const getMoimDetailPath = (meetingId: number) => `${ROUTES.moimDetail}/${meetingId}`;

const createFallbackMetadata = (canonicalPath: string): Metadata => ({
  title: MOIM_DETAIL_FALLBACK_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  alternates: {
    canonical: canonicalPath,
  },
});

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isMeetingDetailData = (value: unknown): value is MeetingDetailData => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    typeof value.participantCount === "number" &&
    typeof value.region === "string" &&
    typeof value.type === "string"
  );
};

const parseMeetingDetail = (response: unknown): MeetingDetailData | null => {
  if (!isRecord(response)) {
    return null;
  }

  const resolvedMeeting = "data" in response ? response.data : response;

  if (!isMeetingDetailData(resolvedMeeting)) {
    return null;
  }

  return resolvedMeeting;
};

const getMeetingCategoryLabel = (meeting: MeetingDetailData) => {
  const regionLabel = meeting.region === "online" ? "온라인" : "오프라인";
  const typeLabel = meeting.type === "project" ? "프로젝트" : "스터디";

  return `${regionLabel} ${typeLabel}`;
};

const formatMeetingDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
};

const buildFallbackDescription = (meeting: MeetingDetailData) => {
  const categoryLabel = getMeetingCategoryLabel(meeting);
  const meetingDate = formatMeetingDate(meeting.dateTime);
  const dateSegment = meetingDate ? `${meetingDate} 진행 예정이며` : "함께 진행할 멤버를 모집 중이며";

  return `${categoryLabel} 모임으로 ${dateSegment} 현재 ${meeting.participantCount}명이 참여 중입니다.`;
};

const buildDescription = (meeting: MeetingDetailData) => {
  const normalizedDescription = normalizeWhitespace(meeting.description ?? "");

  if (normalizedDescription.length > 0) {
    return truncateText(normalizedDescription, DESCRIPTION_MAX_LENGTH);
  }

  return buildFallbackDescription(meeting);
};

export const getMoimDetailMetadata = async (meetingId: number): Promise<Metadata> => {
  const canonicalPath = getMoimDetailPath(meetingId);

  try {
    const response = await api.meetings.getDetail(meetingId);
    const meeting = parseMeetingDetail(response);

    if (!meeting) {
      return createFallbackMetadata(canonicalPath);
    }

    const title = normalizeWhitespace(meeting.name) || MOIM_DETAIL_FALLBACK_TITLE;
    const description = buildDescription(meeting);

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        url: canonicalPath,
        type: "website",
        images: meeting.image
          ? [
              {
                url: meeting.image,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return createFallbackMetadata(canonicalPath);
  }
};
