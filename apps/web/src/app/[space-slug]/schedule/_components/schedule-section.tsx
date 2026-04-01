import { ScheduleList } from "@/_pages/schedule";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";
import type { SpaceInfo } from "@/entities/spaces";

interface ScheduleSectionProps {
  space: SpaceInfo;
  membership: any;
}

export const ScheduleSection = async ({ space, membership }: ScheduleSectionProps) => {
  const scheduleData = await getSchedulesUseCase(space.spaceId, membership.userId);

  return <ScheduleList slug={space.slug} upcoming={scheduleData.upcoming} expired={scheduleData.expired} />;
};
