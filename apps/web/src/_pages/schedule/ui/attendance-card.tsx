"use client";

import { Check } from "@moum-zip/ui/icons";
import { useTransition } from "react";
import type { AttendanceStatus } from "@/entities/schedule";
import { formatTodayKST } from "@/shared/lib/date";
import { checkAttendanceAction } from "../actions";

interface AttendanceCardProps {
  slug: string;
  attendance: AttendanceStatus;
  totalMembers: number;
}

export function AttendanceCard({ slug, attendance, totalMembers }: AttendanceCardProps) {
  const [isPending, startTransition] = useTransition();

  const today = formatTodayKST();

  function handleCheckIn() {
    startTransition(async () => {
      try {
        await checkAttendanceAction(slug);
      } catch (err) {
        alert(err instanceof Error ? err.message : "출석 체크에 실패했습니다.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-base">오늘의 출석</h3>
        <p className="text-neutral-500 text-sm">{today}</p>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-foreground">{attendance.todayAttendeeIds.length}</span>
          <span className="text-neutral-400 text-xs">/ {totalMembers}명 출석</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-3">
          <Check size={16} className="text-primary" />
        </div>
      </div>

      {attendance.hasCheckedIn ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3">
          {/* TODO: lucid icon으로 교체하기 */}
          <Check size={16} className="text-primary" />
          <span className="font-medium text-primary text-sm">오늘 출석을 완료했습니다</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCheckIn}
          disabled={isPending}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "출석 중..." : "출석 체크하기"}
        </button>
      )}
    </div>
  );
}
