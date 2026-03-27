"use client";

import { useTransition } from "react";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { formatScheduleRange } from "@/shared/lib/date";
import { deleteScheduleAction } from "../actions";

interface ScheduleItemProps {
  schedule: ScheduleWithStatus;
  slug: string;
  onEdit: (schedule: ScheduleWithStatus) => void;
}

export function ScheduleItem({ schedule, slug, onEdit }: ScheduleItemProps) {
  const [isPending, startTransition] = useTransition();

  const borderColor = schedule.isOngoing
    ? "border-l-green-500"
    : schedule.isExpired
      ? "border-l-neutral-300"
      : "border-l-blue-500";

  const statusLabel = schedule.isOngoing
    ? { text: "진행 중", className: "bg-green-50 text-green-600" }
    : schedule.isExpired
      ? { text: "종료", className: "bg-neutral-100 text-neutral-400" }
      : { text: "예정", className: "bg-blue-50 text-blue-600" };

  function handleDelete() {
    if (!confirm("일정을 삭제하시겠습니까?")) return;
    startTransition(() => deleteScheduleAction(slug, schedule.id));
  }

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-xl border border-border border-l-4 bg-background px-4 py-3.5 shadow-sm transition-opacity ${borderColor} ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 font-semibold text-xs ${statusLabel.className}`}
          >
            {statusLabel.text}
          </span>
          <p className="text-neutral-500 text-xs">{formatScheduleRange(schedule.startAt, schedule.endAt)}</p>
        </div>
        {!schedule.isExpired && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(schedule)}
              disabled={isPending}
              className="rounded px-2 py-1 text-neutral-400 text-xs transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded px-2 py-1 text-red-400 text-xs transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <p className="font-semibold text-foreground text-sm">{schedule.title}</p>
      {schedule.description && (
        <p className="line-clamp-2 text-neutral-500 text-sm leading-relaxed">{schedule.description}</p>
      )}
    </div>
  );
}
