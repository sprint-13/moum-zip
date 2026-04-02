import { Suspense } from "react";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { AttendanceCardSection } from "./_components/attendance-card-section";
import { ScheduleSection } from "./_components/schedule-section";

export default async function SchedulePage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];

  const { space, membership } = await getSpaceContext(slug);

  return (
    <>
      <SpaceHeader title="일정" description="스페이스 일정을 확인하고 출석을 체크하세요." />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<ScheduleListSkeleton />}>
            <ScheduleSection space={space} />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <Suspense fallback={<AttendanceCardSkeleton />}>
            <AttendanceCardSection space={space} membership={membership} />
          </Suspense>
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function ScheduleListSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 px-3 pb-2">
      <div className="h-10 rounded-lg bg-muted" />
      <div className="flex flex-col gap-3 rounded-lg bg-background p-4 shadow-sm">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="h-14 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

function AttendanceCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
      <div className="h-16 rounded-lg bg-muted" />
      <div className="h-11 rounded-lg bg-muted" />
    </div>
  );
}
