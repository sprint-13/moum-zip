import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { DashboardAttendanceCard } from "@/_pages/schedule/ui/dashboard-attendance-card";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";

interface DashboardAttendanceSectionProps {
  spaceId: string;
  userId: number;
  slug: string;
}

export const DashboardAttendanceSection = async ({ spaceId, userId, slug }: DashboardAttendanceSectionProps) => {
  const [scheduleData, members] = await Promise.all([
    getSchedulesUseCase(spaceId, userId),
    queryAllMembersUseCase(spaceId),
  ]);

  return <DashboardAttendanceCard slug={slug} attendance={scheduleData.attendance} totalMembers={members.length} />;
};
