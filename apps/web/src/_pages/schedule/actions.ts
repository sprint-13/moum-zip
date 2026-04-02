"use server";

import { revalidatePath, updateTag } from "next/cache";
import { kstInputToDate } from "@/entities/schedule";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { checkAttendanceUseCase } from "./use-cases/check-attendance";
import { createScheduleUseCase } from "./use-cases/create-schedule";
import { deleteScheduleUseCase } from "./use-cases/delete-schedule";
import { updateScheduleUseCase } from "./use-cases/update-schedule";

function invalidateSchedule(spaceId: string, slug: string) {
  updateTag(CACHE_TAGS.schedule(spaceId));
  revalidatePath(`/${slug}`); // 대시보드 일정 위젯 반영
}

function invalidateAttendance(spaceId: string, slug: string) {
  updateTag(CACHE_TAGS.attendance(spaceId));
  revalidatePath(`/${slug}`); // 대시보드 출석 현황 반영
}

/** 일정 추가 Server Action */
export async function createScheduleAction(slug: string, formData: FormData) {
  const { space, membership } = await getSpaceContext(slug);

  const title = formData.get("title");
  const description = formData.get("description");
  const startAt = formData.get("startAt");

  if (typeof title !== "string") throw new Error("제목을 입력해주세요.");
  if (typeof startAt !== "string" || !startAt) throw new Error("날짜를 선택해주세요.");

  await createScheduleUseCase({
    spaceId: space.spaceId,
    createdBy: membership.userId,
    title,
    description: typeof description === "string" && description ? description : undefined,
    startAt: kstInputToDate(startAt),
  });

  invalidateSchedule(space.spaceId, slug);
}

/** 일정 수정 Server Action */
export async function updateScheduleAction(slug: string, scheduleId: string, formData: FormData) {
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
