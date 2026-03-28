import { UserPlus } from "@moum-zip/ui/icons";
import { MemberTable, OnlineNowCard, QuickActionsCard, RolesOverviewCard } from "@/_pages/members";
import { getSpaceMembersUseCase } from "@/_pages/members/use-cases/get-space-members";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
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
  const { space } = await getSpaceContext(slug);
  const { members } = await getSpaceMembersUseCase(space.spaceId);

  return (
    <>
      <SpaceHeader title="Members" buttonGroup={InviteButton} />
      <SpaceBody>
        <SpaceBodyLeft>
          <MemberTable members={members} />
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <OnlineNowCard members={members} />
          <RolesOverviewCard members={members} />
          <QuickActionsCard />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
