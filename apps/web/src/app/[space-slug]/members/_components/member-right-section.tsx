import { OnlineNowCard, PendingMemberCard, RolesOverviewCard } from "@/_pages/members";
import { addSpaceMemberAction } from "@/_pages/members/action";
import { getPendingMembersRemote } from "@/_pages/members/use-cases/get-pending-members";
import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import type { SpaceInfo } from "@/entities/spaces";
import { hasPermission } from "@/features/space";
import type { Requester } from "@/features/space/lib/assert-permission";

interface MemberRightSectionProps {
  space: SpaceInfo;
  membership: Requester;
}

export const MemberRightSection = async ({ space, membership }: MemberRightSectionProps) => {
  const [allMembers, { pendingMembers }] = await Promise.all([
    queryAllMembersUseCase(space.spaceId),
    membership.role === "manager"
      ? getPendingMembersRemote(Number(space.spaceId))
      : Promise.resolve({ pendingMembers: [] }),
  ]);

  const acceptMember = addSpaceMemberAction.bind(null, space.slug);

  return (
    <>
      <OnlineNowCard members={allMembers} />
      <RolesOverviewCard members={allMembers} />
      {hasPermission({ userId: membership.userId, role: membership.role }) ? (
        <PendingMemberCard pendingMembers={pendingMembers} onAccept={acceptMember} />
      ) : null}
    </>
  );
};
