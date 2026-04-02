import { DashboardScheduleContent } from "@/_pages/schedule/ui/dashboard-schedule-content";
import { getScheduleListUseCase } from "@/_pages/schedule/use-cases/get-schedule-list";

interface DashboardScheduleSectionProps {
  spaceId: string;
  userId: number;
  slug: string;
}

export const DashboardScheduleSection = async ({ spaceId, userId: _userId, slug }: DashboardScheduleSectionProps) => {
  const scheduleData = await getScheduleListUseCase(spaceId);
  return <DashboardScheduleContent upcoming={scheduleData.upcoming} slug={slug} />;
};
