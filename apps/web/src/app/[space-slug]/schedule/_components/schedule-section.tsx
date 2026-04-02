import { ScheduleList } from "@/_pages/schedule";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";
import type { SpaceInfo } from "@/entities/spaces";
import type { Requester } from "@/features/space/lib/assert-permission";

interface ScheduleSectionProps {
  space: SpaceInfo;
  membership: Requester;
}

export const ScheduleSection = async ({ space, membership }: ScheduleSectionProps) => {
  const scheduleData = await getSchedulesUseCase(space.spaceId, membership.userId);

  return <ScheduleList slug={space.slug} upcoming={scheduleData.upcoming} expired={scheduleData.expired} />;
};
