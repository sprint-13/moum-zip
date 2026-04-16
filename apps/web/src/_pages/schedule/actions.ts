"use server";

import { revalidatePath, updateTag } from "next/cache";
import { kstInputToDate, scheduleSchema } from "@/entities/schedule";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";
import { reportError } from "@/shared/lib/errors/report-error";
import { handleAppError } from "@/shared/lib/handle-app-error";
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

function invalidateAttendance(spaceId: string, userId: number, slug: string) {
  updateTag(CACHE_TAGS.grass(spaceId, userId));
  updateTag(CACHE_TAGS.attendance(spaceId, userId));
  revalidatePath(`/${slug}`); // 대시보드 출석 현황 반영
}

/** 일정 추가 Server Action */
export async function createScheduleAction(
  slug: string,
  _: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const { space, membership } = await getSpaceContext(slug).catch(handleAppError);
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = scheduleSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { ok: false, message: "입력 값을 확인해주세요" };
  }

  try {
    await createScheduleUseCase({
      spaceId: space.spaceId,
      createdBy: membership.userId,
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      startAt: kstInputToDate(`${validatedFields.data.date}T${validatedFields.data.time}`),
    });
  } catch (err) {
    await reportError(err, {
      fallbackMessage: "일정 생성 중 오류가 발생했습니다.",
      tags: { scope: "schedule-action", stage: "create" },
    });
    return {
      ok: false,
      message: await getErrorMessage(err, {
        fallbackMessage: "일정 생성 중 오류가 발생했습니다.",
      }),
    };
  }

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
  const { space } = await getSpaceContext(slug).catch(handleAppError);
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = scheduleSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { ok: false, message: "입력 값을 확인해주세요" };
  }

  try {
    await updateScheduleUseCase(scheduleId, {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      startAt: kstInputToDate(`${validatedFields.data.date}T${validatedFields.data.time}`),
    });
  } catch (err) {
    await reportError(err, {
      fallbackMessage: "일정 수정 중 오류가 발생했습니다.",
      tags: { scope: "schedule-action", stage: "update" },
    });
    return {
      ok: false,
      message: await getErrorMessage(err, {
        fallbackMessage: "일정 수정 중 오류가 발생했습니다.",
      }),
    };
  }

  invalidateSchedule(space.spaceId, slug);
  return { ok: true, data: undefined };
}

/** 일정 삭제 Server Action */
export async function deleteScheduleAction(slug: string, scheduleId: string) {
  const { space } = await getSpaceContext(slug).catch(handleAppError);
  await deleteScheduleUseCase(scheduleId);
  invalidateSchedule(space.spaceId, slug);
}

/** 출석 체크 Server Action */
export async function checkAttendanceAction(slug: string) {
  const { space, membership } = await getSpaceContext(slug).catch(handleAppError);
  await checkAttendanceUseCase(space.spaceId, membership.userId);
  invalidateAttendance(space.spaceId, membership.userId, slug);
}
