import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { DashboardAttendanceCard } from "@/_pages/schedule/ui/dashboard-attendance-card";
import { getAttendanceStatusUseCase } from "@/_pages/schedule/use-cases/get-attendance-status";

interface DashboardAttendanceSectionProps {
  spaceId: string;
  userId: number;
  slug: string;
}

export const DashboardAttendanceSection = async ({ spaceId, userId, slug }: DashboardAttendanceSectionProps) => {
  const [attendance, members] = await Promise.all([
    getAttendanceStatusUseCase(spaceId, userId),
    queryAllMembersUseCase(spaceId),
  ]);

  return <DashboardAttendanceCard slug={slug} attendance={attendance} totalMembers={members.length} />;
};
