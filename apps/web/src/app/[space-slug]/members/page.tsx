import { UserPlus } from "@moum-zip/ui/icons";
import { Suspense } from "react";
import { MemberTable } from "@/_pages/members";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { parsePaginationParams } from "@/shared/lib/pagination";
import { MemberRightSection } from "./_components/member-right-section";

const InviteButton = (
  <button
    type="button"
    className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
  >
    <UserPlus className="size-4" />
    Invite Member
  </button>
);

export default async function SpaceMembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ "space-slug": string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const slug = (await params)["space-slug"];

  const { space, membership } = await getSpaceContext(slug);
  const { page } = parsePaginationParams(await searchParams);

  return (
    <>
      <SpaceHeader
        title="멤버"
        description="스페이스 멤버를 조회 및 관리하고 새로운 사용자를 승인해 보세요."
        buttonGroup={InviteButton}
      />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<MemberTableSkeleton />}>
            <MemberTable spaceId={space.spaceId} page={page} currentUserId={membership.userId} />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <Suspense fallback={<MemberRightSectionSkeleton />}>
            <MemberRightSection space={space} membership={membership} />
          </Suspense>
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function MemberTableSkeleton() {
  return (
    <div className="flex animate-pulse flex-col">
      <div className="flex items-center gap-3" />
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between border-border border-b px-5 py-4">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>

        <div className="flex border-border border-b bg-primary/10">
          <div className="w-[220px] shrink-0 p-3">
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          <div className="flex-1 p-3">
            <div className="h-4 w-12 rounded bg-muted" />
          </div>
          <div className="w-20 shrink-0 p-3">
            <div className="mx-auto h-4 w-12 rounded bg-muted" />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-10 rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberRightSectionSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-40 rounded-xl border border-border bg-background shadow-sm" />
      <div className="h-32 rounded-xl border border-border bg-background shadow-sm" />
    </div>
  );
}
