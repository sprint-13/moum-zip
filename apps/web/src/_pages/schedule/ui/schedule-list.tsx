"use client";

import { useState } from "react";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { ScheduleForm } from "./schedule-form";
import { ScheduleItem } from "./schedule-item";

type Tab = "upcoming" | "expired";

interface ScheduleListProps {
  slug: string;
  upcoming: ScheduleWithStatus[];
  expired: ScheduleWithStatus[];
}

export function ScheduleList({ slug, upcoming, expired }: ScheduleListProps) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ScheduleWithStatus | null>(null);

  const items = tab === "upcoming" ? upcoming : expired;

  function openAdd() {
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(schedule: ScheduleWithStatus) {
    setEditTarget(schedule);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditTarget(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 + 추가 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-border bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setTab("upcoming")}
            className={`rounded-md px-4 py-1.5 font-medium text-sm transition-all ${
              tab === "upcoming" ? "bg-background text-foreground shadow-sm" : "text-neutral-500 hover:text-foreground"
            }`}
          >
            예정 · 진행 중
            {upcoming.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground text-xs">
                {upcoming.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("expired")}
            className={`rounded-md px-4 py-1.5 font-medium text-sm transition-all ${
              tab === "expired" ? "bg-background text-foreground shadow-sm" : "text-neutral-500 hover:text-foreground"
            }`}
          >
            지난 일정
          </button>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90"
        >
          + 일정 추가
        </button>
      </div>

      {/* 일정 목록 */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed py-16 text-center">
          <p className="font-medium text-neutral-400 text-sm">
            {tab === "upcoming" ? "예정된 일정이 없습니다." : "지난 일정이 없습니다."}
          </p>
          {tab === "upcoming" && (
            <button type="button" onClick={openAdd} className="mt-2 text-primary text-sm underline underline-offset-2">
              첫 번째 일정을 추가해보세요
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((s) => (
            <ScheduleItem key={s.id} schedule={s} slug={slug} onEdit={openEdit} />
          ))}
        </div>
      )}

      {showForm && <ScheduleForm slug={slug} editTarget={editTarget ?? undefined} onClose={closeForm} />}
    </div>
  );
}
