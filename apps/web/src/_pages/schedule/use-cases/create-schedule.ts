import { scheduleQueries } from "@/entities/schedule/queries";

export interface CreateScheduleInput {
  spaceId: string;
  createdBy: number;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
}

/**
 * 일정 생성 유스케이스.
 * - 제목 유효성 검사
 * - 종료 시간이 시작 시간 이후인지 검사
 */
export async function createScheduleUseCase(input: CreateScheduleInput): Promise<{ scheduleId: string }> {
  if (!input.title.trim()) throw new Error("제목을 입력해주세요.");
  if (input.endAt <= input.startAt) throw new Error("종료 시간은 시작 시간 이후여야 합니다.");

  const [schedule] = await scheduleQueries.create({
    id: crypto.randomUUID(),
    spaceId: input.spaceId,
    createdBy: input.createdBy,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    startAt: input.startAt,
    endAt: input.endAt,
  });

  if (!schedule) throw new Error("일정 생성에 실패했습니다.");

  return { scheduleId: schedule.id };
}
