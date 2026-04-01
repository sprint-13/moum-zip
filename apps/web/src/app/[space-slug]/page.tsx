import { DashboardPostContent } from "@/_pages/bulletin/ui/dashboard-post-content";
import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { DashboardAttendanceCard } from "@/_pages/schedule/ui/dashboard-attendance-card";
import { DashboardScheduleContent } from "@/_pages/schedule/ui/dashboard-schedule-content";
import { getSchedulesUseCase } from "@/_pages/schedule/use-cases/get-schedules";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getBulletinPostsUseCase } from "@/features/space/use-cases/get-bulletin-posts";

export default async function SpacePage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];
  const { space, membership } = await getSpaceContext(slug);

  const [bulletinData, scheduleData, membersData] = await Promise.all([
    getBulletinPostsUseCase(space.spaceId),
    getSchedulesUseCase(space.spaceId, membership.userId),
    queryAllMembersUseCase(space.spaceId),
  ]);

  return (
    <>
      <SpaceHeader title="대시보드" description="세션을 조율하고 자료를 공유하며 참여 현황을 확인하세요" />
      <SpaceBody>
        <SpaceBodyLeft>
          <DashboardPostContent posts={bulletinData.posts} slug={slug} />
          <DashboardScheduleContent upcoming={scheduleData.upcoming} slug={slug} />
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <DashboardAttendanceCard slug={slug} attendance={scheduleData.attendance} totalMembers={membersData.length} />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
