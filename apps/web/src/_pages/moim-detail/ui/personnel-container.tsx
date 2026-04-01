"use client";

import { Badge, CheckCircleIcon, ProgressBar } from "@ui/components";
import { cn } from "@ui/lib/utils";

import type { PersonnelData } from "@/entities/moim-detail";

interface PersonnelContainerProps {
  data: PersonnelData;
  className?: string;
}

export function PersonnelContainer({ data, className }: PersonnelContainerProps) {
  const { currentParticipants, maxParticipants, statusLabel, participants, extraCount = 0 } = data;

  const visibleParticipants = participants.slice(0, 4);
  const hiddenCount = Math.max(participants.length - visibleParticipants.length + extraCount, 0);

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-start gap-5",
          "rounded-[1.5rem] border border-[var(--color-personnel-border)]",
          "bg-personnel-gradient px-8 pt-6 pb-6",
          "shadow-[0_8px_24px_rgba(15,23,42,0.05)]",
          "transition-all duration-200",
          "max-sm:gap-4",
          "max-sm:rounded-[1.25rem]",
          "max-sm:px-5 max-sm:pt-5 max-sm:pb-5",
        )}
      >
        <div className="flex w-full flex-col gap-4 max-sm:gap-3.5">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <p className="shrink-0 font-medium text-gray-900 text-lg leading-[1.4] tracking-[-0.02em] max-sm:text-sm">
                <span className="font-bold text-primary">{currentParticipants}</span>명 신청
              </p>

              <div className="flex min-w-0 items-center">
                {visibleParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={cn(
                      "relative flex h-[2rem] w-[2rem] items-center justify-center overflow-hidden rounded-full border border-white bg-emerald-100 font-semibold text-[0.875rem] text-emerald-700 leading-none shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:z-10 hover:scale-105",
                      index !== 0 && "-ml-2",
                      "max-sm:h-7 max-sm:w-7 max-sm:text-xs",
                    )}
                    title={participant.name}
                  >
                    {participant.image ? (
                      <img src={participant.image} alt={participant.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{participant.name.slice(0, 1) || "?"}</span>
                    )}
                  </div>
                ))}

                {hiddenCount > 0 && (
                  <div className="-ml-2.5 flex size-7.25 items-center justify-center rounded-full border border-white bg-white font-semibold text-slate-700 text-sm leading-none max-sm:size-6.5 max-sm:text-[12px]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>

            <Badge variant="confirmed" container="none">
              {statusLabel === "개설확정" && <CheckCircleIcon className="size-6 max-sm:size-4.5" />}
              <span className="font-semibold text-base max-sm:font-medium max-sm:text-xs">
                {statusLabel || "모집중"}
              </span>
            </Badge>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full justify-end">
              <span className="font-medium text-gray-500 text-sm leading-[1.4] max-sm:text-xs">
                최대 {maxParticipants}명
              </span>
            </div>

            <ProgressBar
              aria-label="모임 신청 인원 진행률"
              maxValue={maxParticipants}
              value={currentParticipants}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
