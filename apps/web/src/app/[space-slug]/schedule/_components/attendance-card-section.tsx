import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { AttendanceCard } from "@/_pages/schedule";
import { getAttendanceStatusUseCase } from "@/_pages/schedule/use-cases/get-attendance-status";
import type { SpaceInfo } from "@/entities/spaces";
import type { Requester } from "@/features/space/lib/assert-permission";

interface AttendanceCardSectionProps {
  space: SpaceInfo;
  membership: Requester;
}

export const AttendanceCardSection = async ({ space, membership }: AttendanceCardSectionProps) => {
  const [attendance, members] = await Promise.all([
    getAttendanceStatusUseCase(space.spaceId, membership.userId),
    queryAllMembersUseCase(space.spaceId),
  ]);

  return <AttendanceCard slug={space.slug} attendance={attendance} totalMembers={members.length} />;
};
