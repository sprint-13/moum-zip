const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
});

const formatChipLabel = (dateTime: string | null, formatter: Intl.DateTimeFormat, fallbackLabel: string) => {
  if (!dateTime) {
    return fallbackLabel;
  }

  return formatter.format(new Date(dateTime));
};

export const formatSearchDateChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, dateFormatter, "일정 미정");
};

export const formatSearchTimeChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, timeFormatter, "시간 미정");
};

export const formatSearchDeadlineLabel = (registrationEnd: string | null, now: number = Date.now()) => {
  if (!registrationEnd) {
    return "상시 모집";
  }

  const deadlineTime = new Date(registrationEnd).getTime();
  const remainingTime = deadlineTime - now;

  if (remainingTime <= 0) {
    return "마감";
  }

  const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

  if (remainingDays <= 1) {
    return "오늘 마감";
  }

  return `${remainingDays}일 후 마감`;
};
