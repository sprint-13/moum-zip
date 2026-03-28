"use client";

import type { ScheduleWithStatus } from "@/entities/schedule";
import { SpaceBodyContent } from "@/features/space/ui/space-body-content";
import { ScheduleItem } from "./schedule-item";

interface DashboardScheduleContentProps {
  upcoming: ScheduleWithStatus[];
  slug: string;
}

export function DashboardScheduleContent({ upcoming, slug }: DashboardScheduleContentProps) {
  const items = upcoming.slice(0, 2);

  return (
    <SpaceBodyContent title="다가오는 일정">
      {items.length === 0 ? (
        <p className="py-4 text-center text-neutral-400 text-sm">예정된 일정이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((schedule) => (
            <li key={schedule.id}>
              <ScheduleItem schedule={schedule} slug={slug} />
            </li>
          ))}
        </ul>
      )}
    </SpaceBodyContent>
  );
}
