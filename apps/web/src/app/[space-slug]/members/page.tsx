import { UserPlus } from "@moum-zip/ui/icons";
import { MemberTable, OnlineNowCard, QuickActionsCard, RolesOverviewCard } from "@/_pages/members";
import type { Member } from "@/entities/member";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";

const members: Member[] = [];

const InviteButton = (
  <button
    type="button"
    className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
  >
    <UserPlus className="size-4" />
    Invite Member
  </button>
);

export default async function SpaceMembersPage() {
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
