import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { AttendanceCard, ScheduleList } from "@/_pages/schedule";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";

export default async function SchedulePage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];

  const { space, membership } = await getSpaceContext(slug);

  const [scheduleData, membersData] = await Promise.all([
    getSchedulesUseCase(space.spaceId, membership.userId),
    queryAllMembersUseCase(space.spaceId),
  ]);

  return (
    <>
      <SpaceHeader title="일정" description="스페이스 일정을 확인하고 출석을 체크하세요." />
      <SpaceBody>
        <SpaceBodyLeft>
          <ScheduleList slug={slug} upcoming={scheduleData.upcoming} expired={scheduleData.expired} />
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <AttendanceCard slug={slug} attendance={scheduleData.attendance} totalMembers={membersData.length} />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
