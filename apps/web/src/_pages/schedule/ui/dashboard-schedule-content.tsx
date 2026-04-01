"use client";

import { useRouter } from "next/navigation";
import type { ScheduleWithStatus } from "@/entities/schedule";
import { SpaceBodyContent } from "@/features/space/ui/space-body-content";
import { ScheduleItem } from "./schedule-item";

interface DashboardScheduleContentProps {
  upcoming: ScheduleWithStatus[];
  slug: string;
}

export function DashboardScheduleContent({ upcoming, slug }: DashboardScheduleContentProps) {
  const router = useRouter();
  const items = upcoming.slice(0, 2);

  return (
    <SpaceBodyContent title="다가오는 일정" onOpen={() => router.push(`/${slug}/schedule`)}>
      {items.length === 0 ? (
        <p className="py-4 text-center text-neutral-400 text-sm">예정된 일정이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.slice(0, 2).map((schedule) => (
            <li key={schedule.id}>
              <ScheduleItem schedule={schedule} />
            </li>
          ))}
        </ul>
      )}
    </SpaceBodyContent>
  );
}
