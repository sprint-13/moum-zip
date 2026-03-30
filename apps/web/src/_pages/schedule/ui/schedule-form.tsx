"use client";

import { useEffect, useRef, useTransition } from "react";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { toDatetimeLocalKST } from "@/shared/lib/date";
import { createScheduleAction, updateScheduleAction } from "../actions";

interface ScheduleFormProps {
  slug: string;
  editTarget?: ScheduleWithStatus;
  onClose: () => void;
}

// TODO: react-hook-form 및 zod로 교체하기
export function ScheduleForm({ slug, editTarget, onClose }: ScheduleFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!editTarget;

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    if (isEdit && editTarget) {
      (el.elements.namedItem("title") as HTMLInputElement).value = editTarget.title;
      (el.elements.namedItem("description") as HTMLTextAreaElement).value = editTarget.description ?? "";
      (el.elements.namedItem("startAt") as HTMLInputElement).value = toDatetimeLocalKST(editTarget.startAt);
      (el.elements.namedItem("endAt") as HTMLInputElement).value = toDatetimeLocalKST(editTarget.endAt);
    } else {
      el.reset();
    }
  }, [editTarget, isEdit]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEdit && editTarget) {
          await updateScheduleAction(slug, editTarget.id, formData);
        } else {
          await createScheduleAction(slug, formData);
        }
        onClose();
      } catch (err) {
        alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        <h2 className="mb-5 font-bold text-lg">{isEdit ? "일정 수정" : "일정 추가"}</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="font-medium text-neutral-700 text-sm">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="일정 제목을 입력하세요"
              required
              disabled={isPending}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="font-medium text-neutral-700 text-sm">
              설명
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="일정에 대한 설명을 입력하세요"
              rows={3}
              disabled={isPending}
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startAt" className="font-medium text-neutral-700 text-sm">
                시작 <span className="text-red-500">*</span>
              </label>
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                required
                disabled={isPending}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endAt" className="font-medium text-neutral-700 text-sm">
                종료 <span className="text-red-500">*</span>
              </label>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
                required
                disabled={isPending}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-border px-5 py-2 font-medium text-neutral-600 text-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "저장 중..." : isEdit ? "수정 완료" : "일정 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
