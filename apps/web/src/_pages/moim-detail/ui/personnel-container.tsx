"use client";

import { Badge, CheckCircleIcon, ProgressBar } from "@ui/components";
import { cn } from "@ui/lib/utils";

interface Participant {
  id: number | string;
  name: string;
  avatarText: string;
}

interface PersonnelData {
  currentCount: number;
  maxCount: number;
  statusLabel: string;
  participants: Participant[];
  extraCount?: number;
}

interface PersonnelContainerProps {
  data: PersonnelData;
  className?: string;
}

export function PersonnelContainer({ data, className }: PersonnelContainerProps) {
  const { currentCount, maxCount, statusLabel, participants, extraCount = 0 } = data;

  const visibleParticipants = participants.slice(0, 4);
  const hiddenCount = Math.max(participants.length - visibleParticipants.length + extraCount, 0);

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-157.5 flex-col items-start gap-2.5",
          "rounded-[28px] border border-[var(--color-personnel-border)]",
          "bg-personnel-gradient",
          "px-10 pt-7 pb-8.5",
          "max-sm:gap-2",
          "max-sm:rounded-[20px]",
          "max-sm:px-6 max-sm:pt-5 max-sm:pb-5.5",
        )}
      >
        <div className="flex w-full flex-col gap-4 max-sm:gap-3">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <p className="shrink-0 font-medium text-gray-900 text-lg leading-[1.4] tracking-[-0.02em] max-sm:text-sm">
                <span className="font-bold text-primary">{currentCount}</span>명 참여
              </p>

              <div className="flex min-w-0 items-center">
                {visibleParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={cn(
                      "flex size-7.25 items-center justify-center overflow-hidden rounded-full border border-white bg-emerald-100 font-semibold text-base text-emerald-700 leading-none",
                      index !== 0 && "-ml-2.5",
                      "max-sm:size-6.5 max-sm:text-sm",
                    )}
                    aria-label={participant.name}
                    title={participant.name}
                  >
                    {participant.avatarText}
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
              <CheckCircleIcon className="size-6 max-sm:size-4.5" />
              <span className="font-semibold text-base max-sm:font-medium max-sm:text-xs">{statusLabel}</span>
            </Badge>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full justify-end">
              <span className="font-medium text-gray-500 text-sm leading-[1.4] max-sm:text-xs">최대 {maxCount}명</span>
            </div>

            <ProgressBar
              aria-label="모임 참여 인원 진행률"
              maxValue={maxCount}
              value={currentCount}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
