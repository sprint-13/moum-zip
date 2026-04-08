import { differenceInCalendarDays, isSameDay, isValid } from "date-fns";

import { formatDate } from "@/shared/lib/date";

const parseSearchDate = (dateTime: string | null) => {
  if (!dateTime) {
    return null;
  }

  const parsedDate = new Date(dateTime);

  if (!isValid(parsedDate)) {
    return null;
  }

  return parsedDate;
};

const formatChipLabel = (dateTime: string | null, formatStr: string, fallbackLabel: string) => {
  const parsedDate = parseSearchDate(dateTime);

  if (!parsedDate) {
    return fallbackLabel;
  }

  return formatDate(parsedDate, formatStr, fallbackLabel);
};

export const formatSearchDateChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, "M.d", "일정 미정");
};

export const formatSearchTimeChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, "HH:mm", "시간 미정");
};

export const getSearchDeadlineMeta = (registrationEnd: string | null, now: number = Date.now()) => {
  const deadlineDate = parseSearchDate(registrationEnd);

  if (!deadlineDate) {
    return {
      deadlineLabel: "상시 모집",
      isRegistClosed: false,
    };
  }

  const currentDate = new Date(now);

  if (deadlineDate.getTime() <= currentDate.getTime()) {
    return {
      deadlineLabel: "마감",
      isRegistClosed: true,
    };
  }

  if (isSameDay(deadlineDate, currentDate)) {
    return {
      deadlineLabel: `오늘 ${formatDate(deadlineDate, "HH:mm", "--:--")} 마감`,
      isRegistClosed: false,
    };
  }

  const remainingDays = differenceInCalendarDays(deadlineDate, currentDate);

  return {
    deadlineLabel: `${remainingDays}일 후 마감`,
    isRegistClosed: false,
  };
};

export const formatSearchDeadlineLabel = (registrationEnd: string | null, now: number = Date.now()) => {
  return getSearchDeadlineMeta(registrationEnd, now).deadlineLabel;
};
