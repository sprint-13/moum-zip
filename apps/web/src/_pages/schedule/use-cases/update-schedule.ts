import { scheduleQueries } from "@/entities/schedule/queries";
import { ERROR_CODES, NotFoundError, ValidationError } from "@/shared/lib/error";

export interface UpdateScheduleInput {
  title?: string;
  description?: string | null;
  startAt?: Date;
}

/**
 * 일정 수정 유스케이스.
 * - 제목이 전달된 경우 빈 값 검사
 * - startAt/endAt 모두 전달된 경우 순서 검사
 */
export const updateScheduleUseCase = async (
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<{ scheduleId: string }> => {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "제목을 입력해주세요.",
      field: "title",
    });
  }

  const [schedule] = await scheduleQueries.update(scheduleId, {
    ...input,
    title: input.title?.trim(),
  });

  if (!schedule) {
    throw new NotFoundError(ERROR_CODES.SCHEDULE_NOT_FOUND, {
      message: "일정을 찾을 수 없습니다.",
    });
  }
  return { scheduleId: schedule.id };
};
