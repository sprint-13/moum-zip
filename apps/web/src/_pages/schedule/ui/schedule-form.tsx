"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import type { ScheduleWithStatus } from "@/entities/schedule";
import { toDatetimeLocalKST } from "@/shared/lib/date";
import { DatePicker, TimePicker } from "@/shared/ui";
import { createScheduleAction, updateScheduleAction } from "../actions";

const scheduleSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional(),
  date: z.string().min(1, "날짜를 선택해주세요."),
  time: z.string().min(1, "시간을 선택해주세요."),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleFormProps {
  slug: string;
  editTarget?: ScheduleWithStatus;
  onClose: () => void;
}
// TODO: Form 로직 외부로 분리 필요
export function ScheduleForm({ slug, editTarget, onClose }: ScheduleFormProps) {
  const isEdit = !!editTarget;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema as any),
    defaultValues: { title: "", description: "", date: "", time: "" },
  });

  useEffect(() => {
    if (isEdit && editTarget) {
      const [date, time] = toDatetimeLocalKST(editTarget.startAt).split("T");
      reset({ title: editTarget.title, description: editTarget.description ?? "", date, time });
    } else {
      reset({ title: "", description: "", date: "", time: "" });
    }
  }, [editTarget, isEdit, reset]);

  async function onSubmit(data: ScheduleFormValues) {
    try {
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description ?? "");
      formData.set("startAt", `${data.date}T${data.time}`);

      if (isEdit && editTarget) {
        await updateScheduleAction(slug, editTarget.id, formData);
      } else {
        await createScheduleAction(slug, formData);
      }
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        <h2 className="mb-5 font-bold text-lg">{isEdit ? "일정 수정" : "일정 추가"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="font-medium text-neutral-700 text-sm">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="일정 제목을 입력하세요"
              disabled={isSubmitting}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              {...register("title")}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="font-medium text-neutral-700 text-sm">
              설명
            </label>
            <textarea
              id="description"
              placeholder="일정에 대한 설명을 입력하세요"
              rows={3}
              disabled={isSubmitting}
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-medium text-neutral-700 text-sm">
              날짜 <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-3">
              <Controller
                control={control}
                name="date"
                render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
              />
              <Controller
                control={control}
                name="time"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </div>
            {(errors.date || errors.time) && (
              <p className="text-red-500 text-xs">{errors.date?.message ?? errors.time?.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-5 py-2 font-medium text-neutral-600 text-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "저장 중..." : isEdit ? "수정 완료" : "일정 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
