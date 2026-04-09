import { OnlineNowCard, PendingMemberCard, RolesOverviewCard } from "@/_pages/members";
import { getPendingMembersUseCase } from "@/_pages/members/use-cases/get-pending-members";
import { queryAllMembersUseCase } from "@/_pages/members/use-cases/query-all-members";
import type { Member } from "@/entities/member";
import type { SpaceInfo } from "@/entities/spaces";
import { hasPermission } from "@/features/space";

interface MemberRightSectionProps {
  space: SpaceInfo;
  membership: Member;
}

export const MemberRightSection = async ({ space, membership }: MemberRightSectionProps) => {
  const [allMembers, { pendingMembers }] = await Promise.all([
    queryAllMembersUseCase(space.spaceId),
    membership.role === "manager" ? getPendingMembersUseCase(space.spaceId) : Promise.resolve({ pendingMembers: [] }),
  ]);

  return (
    <>
      {/* 본인을 최상단에 고정 */}
      <OnlineNowCard
        members={[
          ...allMembers.filter((m) => m.userId === membership.userId),
          ...allMembers.filter((m) => m.userId !== membership.userId),
        ]}
      />
      <RolesOverviewCard members={allMembers} />
      {hasPermission({ userId: membership.userId, role: membership.role }) ? (
        <PendingMemberCard slug={space.slug} pendingMembers={pendingMembers} />
      ) : null}
    </>
  );
};
