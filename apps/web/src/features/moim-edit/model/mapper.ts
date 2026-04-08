import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import type { MeetingDetailForEdit } from "@/features/moim-edit/model/types";

const formatDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

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
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

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
};

const mapMeetingTypeToFormType = (type?: string | null): "project" | "study" => {
  if (type === "프로젝트" || type?.toLowerCase() === "project") {
    return "project";
  }

  return "study";
};

const mapFormTypeToMeetingType = (type: MoimCreateFormValues["type"]) => {
  return type === "study" ? "스터디" : "프로젝트";
};

const mapMeetingRegionToLocation = (region?: string | null): "online" | "offline" => {
  if (region === "offline") {
    return "offline";
  }

  return "online";
};

export const mapMeetingDetailToFormValues = (meetingDetail: MeetingDetailForEdit): MoimCreateFormValues => {
  return {
    type: mapMeetingTypeToFormType(meetingDetail.type),
    name: meetingDetail.name ?? "",
    capacity: Number(meetingDetail.capacity ?? 1),
    description: meetingDetail.description ?? "",
    image: meetingDetail.image ?? "",
    location: mapMeetingRegionToLocation(meetingDetail.region),
    date: formatDate(meetingDetail.dateTime),
    time: formatTime(meetingDetail.dateTime),
    deadlineDate: formatDate(meetingDetail.registrationEnd),
    deadlineTime: formatTime(meetingDetail.registrationEnd),
    themeColor: meetingDetail.themeColor ?? "primary",
  };
};

export const mapFormValuesToMeetingPayload = (data: MoimCreateFormValues) => {
  return {
    name: data.name,
    type: mapFormTypeToMeetingType(data.type),
    capacity: data.capacity,
    description: data.description,
    image: data.image,
    region: data.location,
    dateTime: new Date(`${data.date}T${data.time}`).toISOString(),
    registrationEnd: new Date(`${data.deadlineDate}T${data.deadlineTime}`).toISOString(),
  };
};
