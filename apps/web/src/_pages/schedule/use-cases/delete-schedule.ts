import { scheduleQueries } from "@/entities/schedule/queries";

/** 일정 삭제 유스케이스. */
export async function deleteScheduleUseCase(scheduleId: string): Promise<{ scheduleId: string }> {
  const [schedule] = await scheduleQueries.deleteById(scheduleId);
  if (!schedule) throw new Error("일정을 찾을 수 없습니다.");
  return { scheduleId: schedule.id };
}
