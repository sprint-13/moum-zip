import { notFound } from "next/navigation";
import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import { MoimEditForm } from "@/features/moim-edit/ui/moim-edit-form";
import { getApi } from "@/shared/api/server";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

interface MoimEditContentProps {
  meetingId: number;
}

interface MeetingDetailForEdit {
  type: string | null;
  name: string | null;
  capacity: number | null;
  description: string | null;
  image: string | null;
  region: string | null;
  dateTime: string | null;
  registrationEnd: string | null;
  themeColor?: string | null;
}

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

function formatTime(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";

  return `${hour}:${minute}`;
}

function mapMeetingDetailToEditFormValues(meetingDetail: MeetingDetailForEdit): MoimCreateFormValues {
  return {
    type: meetingDetail.type === "프로젝트" ? "project" : "study",
    name: meetingDetail.name ?? "",
    capacity: Number(meetingDetail.capacity ?? 1),
    description: meetingDetail.description ?? "",
    image: meetingDetail.image ?? "",
    location: meetingDetail.region === "offline" ? "offline" : "online",
    date: formatDate(meetingDetail.dateTime),
    time: formatTime(meetingDetail.dateTime),
    deadlineDate: formatDate(meetingDetail.registrationEnd),
    deadlineTime: formatTime(meetingDetail.registrationEnd),
    themeColor: meetingDetail.themeColor ?? "primary",
  };
}

async function MoimEditContent({ meetingId }: MoimEditContentProps) {
  const apiClient = await getApi();

  try {
    const meetingDetailResponse = await apiClient.meetings.getDetail(meetingId);
    const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;

    if (!meetingDetail) {
      return <div>모임 정보를 표시할 수 없습니다.</div>;
    }

    const initialValues = mapMeetingDetailToEditFormValues(meetingDetail);

    return (
      <div className="mx-auto w-full max-w-[1120px] px-5 py-6 md:px-6 md:py-10 xl:px-10">
        <MoimEditForm meetingId={meetingId} initialValues={initialValues} />
      </div>
    );
  } catch {
    return <div>모임 정보를 표시할 수 없습니다.</div>;
  }
}

export default async function MoimEditPage({ params }: PageProps) {
  const { meetingId } = await params;
  const numericMeetingId = Number(meetingId);

  if (!Number.isInteger(numericMeetingId) || numericMeetingId <= 0) {
    notFound();
  }

  return <MoimEditContent meetingId={numericMeetingId} />;
}
