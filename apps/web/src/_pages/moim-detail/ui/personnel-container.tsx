"use client";

import { Badge, CheckCircleIcon, ProgressBar } from "@ui/components";
import { cn } from "@ui/lib/utils";

const mockPersonnel = {
  currentCount: 16,
  minCount: 5,
  maxCount: 20,
  statusLabel: "개설확정",
  participants: [
    { id: 1, name: "김어진", avatarText: "김" },
    { id: 2, name: "권혁진", avatarText: "권" },
    { id: 3, name: "박혜빈", avatarText: "박" },
    { id: 4, name: "이해솔", avatarText: "이" },
    { id: 5, name: "최병찬", avatarText: "최" },
    { id: 6, name: "홍재영", avatarText: "홍" },
  ],
  extraCount: 12,
};

interface PersonnelContainerProps {
  className?: string;
}

export function PersonnelContainer({ className }: PersonnelContainerProps) {
  const { currentCount, minCount, maxCount, statusLabel, participants, extraCount } = mockPersonnel;

  const visibleParticipants = participants.slice(0, 4);
  const hiddenCount = participants.length - visibleParticipants.length + extraCount;

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "flex w-full max-w-[630px] flex-col items-start",
          "rounded-[28px] border border-[#BEEDE7]",
          "bg-[linear-gradient(90deg,#DEF8EA_0%,#D9F6F4_100%)]",
          "px-[40px] pt-[28px] pb-[34px]",
          "gap-[10px]",
          "max-sm:max-w-[343px]",
          "max-sm:px-[24px] max-sm:pt-[20px] max-sm:pb-[22px]",
          "max-sm:gap-[8px]",
        )}
      >
        <div className="flex w-full flex-col gap-[16px] max-sm:gap-[12px]">
          <div className="flex w-full items-start justify-between gap-[12px]">
            <div className="flex min-w-0 items-center gap-[12px]">
              <p className="shrink-0 font-medium text-gray-900 text-lg leading-[1.4] tracking-[-0.02em] max-sm:text-sm">
                <span className="font-bold text-primary">{currentCount}</span>명 참여
              </p>

              <div className="flex items-center" aria-label={`참여자 ${currentCount}명`}>
                {visibleParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={cn(
                      "flex size-[29px] items-center justify-center overflow-hidden rounded-full border-[1px] border-white bg-emerald-100 font-semibold text-base text-emerald-700 leading-none",
                      index !== 0 && "-ml-[10px]",
                      "max-sm:size-[26px]",
                    )}
                    aria-label={participant.name}
                    title={participant.name}
                  >
                    {participant.avatarText}
                  </div>
                ))}

                {hiddenCount > 0 && (
                  <div className="-ml-[10px] flex size-[29px] items-center justify-center rounded-full border-[1px] border-white bg-white font-semibold text-slate-700 text-sm leading-none">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>

            <Badge variant="confirmed" container="none">
              <CheckCircleIcon className="size-[24px] max-sm:size-[18px]" />
              <span className="font-semibold text-base max-sm:font-medium max-sm:text-xs">{statusLabel}</span>
            </Badge>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-slate-600 text-sm leading-[1.4] max-sm:text-xs">최소 {minCount}명</span>
              <span className="font-medium text-slate-600 text-sm leading-[1.4] max-sm:text-xs">최대 {maxCount}명</span>
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
