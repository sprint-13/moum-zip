"use client";

import { Check } from "@moum-zip/ui/icons";
import { useTransition } from "react";
import type { AttendanceStatus } from "@/entities/schedule";
import { checkAttendanceAction } from "../actions";

interface DashboardAttendanceCardProps {
  slug: string;
  attendance: AttendanceStatus;
  totalMembers: number;
}

export function DashboardAttendanceCard({ slug, attendance, totalMembers }: DashboardAttendanceCardProps) {
  const [isPending, startTransition] = useTransition();
  const attendeeCount = attendance.todayAttendeeIds.length;
  const rate = totalMembers > 0 ? Math.round((attendeeCount / totalMembers) * 100) : 0;

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
        <h3 className="font-bold text-base">출석체크</h3>
        <p className="text-neutral-500 text-sm">실시간 출결 상태를 확인하세요.</p>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-sm">출석률</span>
          <span className="font-bold text-foreground text-sm">{rate}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${rate}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-sm">출석 인원</span>
          <span className="font-medium text-foreground text-sm">
            {attendeeCount} / {totalMembers}명
          </span>
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
