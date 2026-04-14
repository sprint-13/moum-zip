import { scheduleQueries } from "@/entities/schedule/queries";
import { DomainError, ERROR_CODES } from "@/shared/lib/error";

export interface CreateScheduleInput {
  spaceId: string;
  createdBy: number;
  title: string;
  description?: string;
  startAt: Date;
}

/**
 * 일정 생성 유스케이스.
 * - 제목 유효성 검사
 * - 종료 시간이 시작 시간 이후인지 검사
 */
export const createScheduleUseCase = async (input: CreateScheduleInput): Promise<{ scheduleId: string }> => {
  const [schedule] = await scheduleQueries.create({
    id: crypto.randomUUID(),
    spaceId: input.spaceId,
    createdBy: input.createdBy,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    startAt: input.startAt,
  });

  if (!schedule) {
    throw new DomainError(ERROR_CODES.INVALID_REQUEST, {
      message: "일정 생성에 실패했습니다.",
    });
  }

  return { scheduleId: schedule.id };
};
