import { scheduleQueries } from "@/entities/schedule/queries";
import { ERROR_CODES, NotFoundError } from "@/shared/lib/error";

/** 일정 삭제 유스케이스. */
export const deleteScheduleUseCase = async (scheduleId: string): Promise<{ scheduleId: string }> => {
  const [schedule] = await scheduleQueries.deleteById(scheduleId);
  if (!schedule) {
    throw new NotFoundError(ERROR_CODES.SCHEDULE_NOT_FOUND, {
      message: "일정을 찾을 수 없습니다.",
    });
  }
  return { scheduleId: schedule.id };
};
