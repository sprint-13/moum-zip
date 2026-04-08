"use server";

import { revalidatePath, updateTag } from "next/cache";
import { kstInputToDate, scheduleSchema } from "@/entities/schedule";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { checkAttendanceUseCase } from "./use-cases/check-attendance";
import { createScheduleUseCase } from "./use-cases/create-schedule";
import { deleteScheduleUseCase } from "./use-cases/delete-schedule";
import { updateScheduleUseCase } from "./use-cases/update-schedule";

type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };
export type ScheduleActionState = ActionResult<void> | null;

function invalidateSchedule(spaceId: string, slug: string) {
  updateTag(CACHE_TAGS.schedule(spaceId));
  revalidatePath(`/${slug}`); // 대시보드 일정 위젯 반영
}

function invalidateAttendance(spaceId: string, slug: string) {
  updateTag(CACHE_TAGS.attendance(spaceId));
  revalidatePath(`/${slug}`); // 대시보드 출석 현황 반영
}

/** 일정 추가 Server Action */
export async function createScheduleAction(
  slug: string,
  _: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const { space, membership } = await getSpaceContext(slug);
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = scheduleSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { ok: false, message: "입력 값을 확인해주세요" };
  }

  await createScheduleUseCase({
    spaceId: space.spaceId,
    createdBy: membership.userId,
    title: validatedFields.data.title,
    description: validatedFields.data.description,
    startAt: kstInputToDate(`${validatedFields.data.date}T${validatedFields.data.time}`),
  });

  invalidateSchedule(space.spaceId, slug);
  return { ok: true, data: undefined };
}

/** 일정 수정 Server Action */
export async function updateScheduleAction(
  slug: string,
  scheduleId: string,
  _: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const { space } = await getSpaceContext(slug);

  const title = formData.get("title");
  const description = formData.get("description");
  const startAt = formData.get("startAt");

  await updateScheduleUseCase(scheduleId, {
    title: typeof title === "string" ? title : undefined,
    description: typeof description === "string" ? description || null : undefined,
    startAt: typeof startAt === "string" && startAt ? kstInputToDate(startAt) : undefined,
  });

  invalidateSchedule(space.spaceId, slug);
  return { ok: true, data: undefined };
}

/** 일정 삭제 Server Action */
export async function deleteScheduleAction(slug: string, scheduleId: string) {
  const { space } = await getSpaceContext(slug);
  await deleteScheduleUseCase(scheduleId);
  invalidateSchedule(space.spaceId, slug);
}

/** 출석 체크 Server Action */
export async function checkAttendanceAction(slug: string) {
  const { space, membership } = await getSpaceContext(slug);
  await checkAttendanceUseCase(space.spaceId, membership.userId);
  invalidateAttendance(space.spaceId, slug);
}
