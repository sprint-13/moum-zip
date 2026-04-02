import { ScheduleList } from "@/_pages/schedule";
import { getScheduleListUseCase } from "@/_pages/schedule/use-cases/get-schedule-list";
import type { SpaceInfo } from "@/entities/spaces";
import type { Requester } from "@/features/space/lib/assert-permission";

interface ScheduleSectionProps {
  space: SpaceInfo;
  membership: Requester;
}

export const ScheduleSection = async ({ space, membership: _membership }: ScheduleSectionProps) => {
  const scheduleData = await getScheduleListUseCase(space.spaceId);

  return <ScheduleList slug={space.slug} upcoming={scheduleData.upcoming} expired={scheduleData.expired} />;
};
