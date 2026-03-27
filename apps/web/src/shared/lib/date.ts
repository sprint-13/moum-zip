import { format, formatDistanceToNow, isDate, isValid } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 데이터를 받아 'yyyy년 M월 d일' 형태로 반환합니다.
 * @param date - Date 객체 또는 날짜 문자열 (null/undefined 허용)
 * @param fallback - 데이터가 없을 경우 보여줄 기본 문구 (기본값: '-')
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  formatStr: string = "yyyy년 M월 d일",
  fallback: string = "-",
): string => {
  if (!date) return fallback;

  // 1. 이미 Date 객체라면 그대로 사용, 아니라면 변환
  const d = isDate(date) ? date : new Date(date);

  // 2. 변환 후에도 유효한 날짜인지 체크 (Invalid Date 방지)
  if (!isValid(d)) return fallback;

  return format(d, formatStr, { locale: ko });
};

/**
 * 스케줄 날짜 범위를 'M월 d일 (E) · HH:mm – HH:mm' 형태로 반환합니다. (KST 기준)
 * 예: "3월 27일 (목) · 14:00 – 16:00"
 */
export const formatScheduleRange = (startAt: Date | string, endAt: Date | string): string => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const kstDate = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(start);

  const kstTime = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  return `${kstDate} · ${kstTime.format(start)} – ${kstTime.format(end)}`;
};

/**
 * 오늘 날짜를 'M월 d일 EEEE' 형태로 반환합니다. (KST 기준)
 * 예: "3월 27일 목요일"
 */
export const formatTodayKST = (): string => {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(new Date());
};

/**
 * 상대 시간을 '방금 전', '5분 전' 등으로 반환합니다.
 */
export const formatRelativeDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  return formatDistanceToNow(d, { addSuffix: true, locale: ko });
};

/**
 * Date 또는 날짜 문자열을 datetime-local 입력 값 형식('yyyy-MM-ddTHH:mm')으로 변환합니다. (KST 기준)
 * <input type="datetime-local" /> 의 value 세팅에 사용합니다.
 */
export const toDatetimeLocalKST = (date: Date | string): string => {
  const d = new Date(date);
  const kst = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return kst.replace(" ", "T");
};
