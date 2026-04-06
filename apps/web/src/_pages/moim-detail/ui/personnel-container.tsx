"use client";

import { Badge, CheckCircleIcon, ProgressBar } from "@ui/components";
import { cn } from "@ui/lib/utils";

import type { PersonnelData } from "@/entities/moim-detail";

interface PersonnelContainerProps {
  data: PersonnelData;
  className?: string;
}

const MAX_VISIBLE_PARTICIPANTS = 4;

export const PersonnelContainer = ({ data, className }: PersonnelContainerProps) => {
  const { currentParticipants, maxParticipants, statusLabel, participants, extraCount = 0 } = data;

  const visibleParticipants = participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const hiddenCount = Math.max(participants.length - visibleParticipants.length + extraCount, 0);

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-start gap-4",
          "rounded-[16px] border border-(--color-personnel-border)",
          "bg-personnel-gradient px-6 py-5",
          "shadow-[0_8px_24px_rgba(15,23,42,0.05)]",
          "transition-all duration-200",
          "max-sm:gap-3.5",
          "max-sm:rounded-[12px]",
          "max-sm:px-4 max-sm:py-4",
        )}
      >
        <div className="flex w-full flex-col gap-3 max-sm:gap-2.5">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <p className="shrink-0 font-medium text-[16px] text-gray-900 leading-[1.4] tracking-[-0.02em] max-sm:text-[14px]">
                <span className="font-bold text-primary">{currentParticipants}</span>명 신청
              </p>

              <div className="flex min-w-0 items-center">
                {visibleParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={cn(
                      "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white bg-emerald-100 font-semibold text-[13px] text-emerald-700 leading-none shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:z-10 hover:scale-105",
                      index !== 0 && "-ml-1.5",
                      "max-sm:h-6 max-sm:w-6 max-sm:text-[12px]",
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

                {hiddenCount > 0 ? (
                  <div className="relative z-20 -ml-2 flex h-7 min-w-7 items-center justify-center rounded-full border border-white bg-white px-1.5 font-semibold text-[13px] text-slate-700 leading-none max-sm:h-6 max-sm:min-w-6 max-sm:text-[12px]">
                    +{hiddenCount}
                  </div>
                ) : null}
              </div>
            </div>

            <Badge variant="confirmed" container="none">
              {statusLabel === "개설확정" ? (
                <CheckCircleIcon className="h-4.5 w-4.5 max-sm:h-3.5 max-sm:w-3.5" />
              ) : null}
              <span className="font-semibold text-[14px] max-sm:font-medium max-sm:text-[12px]">
                {statusLabel || "모집중"}
              </span>
            </Badge>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <div className="flex w-full justify-end">
              <span className="font-medium text-[13px] text-gray-500 leading-[1.4] max-sm:text-[12px]">
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
};
