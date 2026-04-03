import { ScheduleList } from "@/_pages/schedule";
import { getScheduleListUseCase } from "@/_pages/schedule/use-cases/get-schedule-list";
import type { SpaceInfo } from "@/entities/spaces";

interface ScheduleSectionProps {
  space: SpaceInfo;
}

export const ScheduleSection = async ({ space }: ScheduleSectionProps) => {
  const scheduleData = await getScheduleListUseCase(space.spaceId);

  return <ScheduleList slug={space.slug} upcoming={scheduleData.upcoming} expired={scheduleData.expired} />;
};
