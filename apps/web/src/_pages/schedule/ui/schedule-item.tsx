"use client";

import { Clock } from "@moum-zip/ui/icons";
import { useTransition } from "react";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { hasPermission, useSpaceContext } from "@/features/space";
import { formatDate } from "@/shared/lib/date";
import { deleteScheduleAction } from "../actions";

interface ScheduleItemProps {
  schedule: ScheduleWithStatus;
  onEdit?: (schedule: ScheduleWithStatus) => void;
}

const TimeCard = ({ date }: { date: Date | string }) => {
  const month = formatDate(date, "M 월");
  const day = formatDate(date, "d 일");
  return (
    <time className="flex min-w-13 flex-col items-center gap-1 rounded-xl bg-muted/70 p-2">
      <span className="text-gray-700 text-sm">{month}</span>
      <span className="font-semibold text-gray-700">{day}</span>
    </time>
  );
};

export function ScheduleItem({ schedule, onEdit }: ScheduleItemProps) {
  const [isPending, startTransition] = useTransition();
  const { space, membership } = useSpaceContext();

  const borderColor = schedule.isExpired ? "border-l-neutral-300" : "border-l-green-500";

  const statusLabel = schedule.isExpired
    ? { text: "종료", className: "bg-neutral-100 text-neutral-400" }
    : { text: "예정", className: "bg-green-50 text-green-600" };

  function handleDelete() {
    if (!confirm("일정을 삭제하시겠습니까?")) return; // TODO: 모달 처리
    startTransition(async () => {
      try {
        await deleteScheduleAction(space.slug, schedule.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "일정 삭제에 실패했습니다."); // TODO: 모달 처리
      }
    });
  }
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-xl border border-border/50 border-l-4 bg-background px-4 py-3 shadow-sm transition-opacity ${borderColor} ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col items-start justify-between gap-2">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 font-semibold text-xs ${statusLabel.className}`}
          >
            {statusLabel.text}
          </span>
          <TimeCard date={schedule.startAt} />
        </div>
        <div className="ml-3 flex flex-1 flex-col justify-between">
          <p className="whitespace-normal break-all font-semibold text-foreground text-lg">{schedule.title}</p>
          <p className="whitespace-normal break-all text-base text-gray-500">{schedule.description}</p>
          <p className="flex items-center gap-2 font-medium text-gray-500 text-sm">
            <Clock className="size-3" /> {formatDate(schedule.startAt, "hh:mm")}
          </p>
        </div>
        {onEdit !== undefined &&
        hasPermission(schedule.createdBy, { userId: membership.userId, role: membership.role }) ? (
          <div>
            {!schedule.isExpired && (
              <div className="flex shrink-0 flex-col items-center">
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
        ) : null}
      </div>
    </div>
  );
}
