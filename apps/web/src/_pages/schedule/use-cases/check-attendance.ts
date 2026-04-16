import { getTodayKST } from "@/entities/schedule/model/types";
import { attendanceQueries } from "@/entities/schedule/queries";
import { DomainError, ERROR_CODES } from "@/shared/lib/error";

/**
 * 출석 체크 유스케이스.
 * - KST 기준 오늘 날짜로 중복 체크 방지
 * - DB unique 제약(spaceId, userId, date)이 백스톱으로 동작
 */
export const checkAttendanceUseCase = async (spaceId: string, userId: number): Promise<{ attendanceId: string }> => {
  const today = getTodayKST(); // TODO: date.ts로 이동 및 date-fns로 리팩토링

  const existing = await attendanceQueries.findByUserAndDate(spaceId, userId, today);
  if (existing) {
    throw new DomainError(ERROR_CODES.ALREADY_ATTENDED, {
      message: "오늘 이미 출석 체크를 완료했습니다.",
    });
  }

  const [attendance] = await attendanceQueries.create({
    id: crypto.randomUUID(),
    spaceId,
    userId,
    date: today,
  });

  return { attendanceId: attendance.id };
};
