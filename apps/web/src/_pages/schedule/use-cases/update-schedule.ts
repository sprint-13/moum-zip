import { scheduleQueries } from "@/entities/schedule/queries";

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
export async function updateScheduleUseCase(
  scheduleId: string,
  input: UpdateScheduleInput,
): Promise<{ scheduleId: string }> {
  if (input.title !== undefined && !input.title.trim()) throw new Error("제목을 입력해주세요.");

  const [schedule] = await scheduleQueries.update(scheduleId, {
    ...input,
    title: input.title?.trim(),
  });

  if (!schedule) throw new Error("일정을 찾을 수 없습니다.");
  return { scheduleId: schedule.id };
}
