import { Suspense } from "react";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { DashboardAttendanceSection } from "./_components/dashboard-attendance-section";
import { DashboardGrassSection } from "./_components/dashboard-grass-section";
import { DashboardPostSection } from "./_components/dashboard-post-section";
import { DashboardScheduleSection } from "./_components/dashboard-schedule-section";

export default async function SpacePage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];
  const { space, membership } = await getSpaceContext(slug);

  return (
    <>
      <SpaceHeader title="대시보드" description="세션을 조율하고 자료를 공유하며 참여 현황을 확인하세요" />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<DashboardPostSkeleton />}>
            <DashboardPostSection spaceId={space.spaceId} slug={slug} />
          </Suspense>
          <Suspense fallback={<DashboardScheduleSkeleton />}>
            <DashboardScheduleSection spaceId={space.spaceId} userId={membership.userId} slug={slug} />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <Suspense fallback={<DashboardAttendanceSkeleton />}>
            <DashboardAttendanceSection spaceId={space.spaceId} userId={membership.userId} slug={slug} />
          </Suspense>
          <Suspense fallback={<DashboardGrassSkeleton />}>
            <DashboardGrassSection spaceId={space.spaceId} userId={membership.userId} />
          </Suspense>
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function DashboardPostSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="mb-2 h-5 w-24 rounded bg-muted" />
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        <div key={i} className="h-10 rounded bg-muted" />
      ))}
    </div>
  );
}

function DashboardScheduleSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="mb-2 h-5 w-28 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function DashboardAttendanceSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-4 w-36 rounded bg-muted" />
      </div>
      <div className="h-20 rounded-lg bg-muted" />
      <div className="h-11 rounded-lg bg-muted" />
    </div>
  );
}

function DashboardGrassSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        {Array.from({ length: 84 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={index} className="h-3.5 w-3.5 rounded-[4px] bg-muted" />
        ))}
      </div>
    </div>
  );
}
