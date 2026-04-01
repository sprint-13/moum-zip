import { UserPlus } from "@moum-zip/ui/icons";
import { Suspense } from "react";
import { MemberTable, OnlineNowCard, PendingMemberCard, RolesOverviewCard } from "@/_pages/members";
import { addSpaceMemberAction } from "@/_pages/members/action";
import { getPendingMembersRemote } from "@/_pages/members/use-cases/get-pending-members";
import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import { hasPermission, SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";

const InviteButton = (
  <button
    type="button"
    className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
  >
    <UserPlus className="size-4" />
    Invite Member
  </button>
);

export default async function SpaceMembersPage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];
  // layout에서 이미 검증 완료 + React.cache()로 메모이제이션된 결과 반환 (DB 재조회 없음)
  const { space, membership } = await getSpaceContext(slug);

  const membersPromise = queryAllMembersUseCase(space.spaceId);
  // TODO 쿼리 조회 하위로 내리기
  const pendingMembersPromise =
    membership.role === "manager"
      ? getPendingMembersRemote(Number(space.spaceId))
      : Promise.resolve({ pendingMembers: [] });

  const [allMembers, { pendingMembers }] = await Promise.all([membersPromise, pendingMembersPromise]);

  const acceptMember = addSpaceMemberAction.bind(null, slug);

  return (
    <>
      <SpaceHeader title="Members" buttonGroup={InviteButton} />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<MemberTableSkeleton />}>
            <MemberTable />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <OnlineNowCard members={allMembers} />
          <RolesOverviewCard members={allMembers} />
          {hasPermission({ userId: membership.userId, role: membership.role }) ? (
            <PendingMemberCard pendingMembers={pendingMembers} onAccept={acceptMember} />
          ) : null}
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function MemberTableSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 px-3 pb-2">
      <div className="h-12 rounded-t-lg bg-muted" />
      <div className="flex flex-col gap-3 rounded-lg rounded-t-none bg-background p-4 shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="h-10 rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
