const KST_TIME_ZONE = "Asia/Seoul";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
  timeZone: KST_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  timeZone: KST_TIME_ZONE,
});

const kstDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "numeric",
  timeZone: KST_TIME_ZONE,
  year: "numeric",
});

const formatChipLabel = (dateTime: string | null, formatter: Intl.DateTimeFormat, fallbackLabel: string) => {
  if (!dateTime) {
    return fallbackLabel;
  }

  return formatter.format(new Date(dateTime));
};

const toDeadlineTime = (registrationEnd: string | null) => {
  if (!registrationEnd) {
    return null;
  }

  const deadlineTime = Date.parse(registrationEnd);

  if (Number.isNaN(deadlineTime)) {
    return null;
  }

  return deadlineTime;
};

const isSameDayInKst = (a: number, b: number) => {
  return kstDateFormatter.format(new Date(a)) === kstDateFormatter.format(new Date(b));
};

export const formatSearchDateChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, dateFormatter, "일정 미정");
};

export const formatSearchTimeChipLabel = (dateTime: string | null) => {
  return formatChipLabel(dateTime, timeFormatter, "시간 미정");
};

export const getSearchDeadlineMeta = (registrationEnd: string | null, now: number = Date.now()) => {
  const deadlineTime = toDeadlineTime(registrationEnd);

  if (deadlineTime === null) {
    return {
      deadlineLabel: "상시 모집",
      isRegistClosed: false,
    };
  }

  const remainingTime = deadlineTime - now;

  if (remainingTime <= 0) {
    return {
      deadlineLabel: "마감",
      isRegistClosed: true,
    };
  }

  if (isSameDayInKst(now, deadlineTime)) {
    return {
      deadlineLabel: `오늘 ${timeFormatter.format(new Date(deadlineTime))} 마감`,
      isRegistClosed: false,
    };
  }

  const remainingDays = Math.ceil(remainingTime / MS_PER_DAY);

  return {
    deadlineLabel: `${remainingDays}일 후 마감`,
    isRegistClosed: false,
  };
};

export const formatSearchDeadlineLabel = (registrationEnd: string | null, now: number = Date.now()) => {
  return getSearchDeadlineMeta(registrationEnd, now).deadlineLabel;
};
