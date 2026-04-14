import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import type { MeetingDetailForEdit } from "@/features/moim-edit/model/types";

const formatDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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
  const normalizedType = type?.trim().toLowerCase();

  if (type === "프로젝트" || normalizedType === "project") {
    return "project";
  }

  return "study";
};

const mapFormTypeToMeetingType = (type: MoimCreateFormValues["type"]) => {
  return type === "study" ? "스터디" : "프로젝트";
};

const normalizeRegion = (region?: string | null) => {
  if (!region) {
    return "";
  }

  return region.trim().toLowerCase();
};

const mapMeetingRegionToLocation = (region?: string | null): "online" | "offline" => {
  const normalizedRegion = normalizeRegion(region);

  if (normalizedRegion === "offline" || normalizedRegion === "오프라인") {
    return "offline";
  }

  if (normalizedRegion === "online" || normalizedRegion === "온라인") {
    return "online";
  }

  return "online";
};

const mapMeetingCapacity = (capacity?: number | string | null) => {
  const parsedCapacity = Number(capacity);

  if (Number.isNaN(parsedCapacity) || parsedCapacity < 1) {
    return 1;
  }

  return parsedCapacity;
};

export const mapMeetingDetailToFormValues = (meetingDetail: MeetingDetailForEdit): MoimCreateFormValues => {
  return {
    type: mapMeetingTypeToFormType(meetingDetail.type),
    name: meetingDetail.name ?? "",
    capacity: mapMeetingCapacity(meetingDetail.capacity),
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
