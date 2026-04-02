import { DashboardScheduleContent } from "@/_pages/schedule/ui/dashboard-schedule-content";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";

interface DashboardScheduleSectionProps {
  spaceId: string;
  userId: number;
  slug: string;
}

export const DashboardScheduleSection = async ({ spaceId, userId, slug }: DashboardScheduleSectionProps) => {
  const scheduleData = await getSchedulesUseCase(spaceId, userId);
  return <DashboardScheduleContent upcoming={scheduleData.upcoming} slug={slug} />;
};
