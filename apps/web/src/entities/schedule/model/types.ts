import type { Attendance, Schedule } from "@/shared/db/scheme";

export type { Schedule, Attendance };

/**
 * KST(Asia/Seoul) 기준 현재 시각을 Date 객체로 반환.
 * Neon 서버 런타임은 UTC이므로 timezone 변환이 필요하다.
 */
export function getNowKST(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
}

/**
 * KST 기준 오늘 날짜를 YYYY-MM-DD 형식으로 반환.
 * sv-SE 로케일은 ISO 8601 날짜 형식(YYYY-MM-DD)을 사용한다.
 */
export function getTodayKST(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
}

/** KST datetime-local 문자열("2026-03-26T14:00")을 UTC Date로 변환 */
export function kstInputToDate(kstString: string): Date {
  return new Date(`${kstString}:00.000+09:00`);
}

/** 일정의 만료/진행 상태 */
export interface ScheduleWithStatus extends Schedule {
  isExpired: boolean;
  isUpcoming: boolean;
}

/** 오늘의 출석 체크 현황 */
export interface AttendanceStatus {
  hasCheckedIn: boolean;
  todayAttendeeIds: number[];
}
