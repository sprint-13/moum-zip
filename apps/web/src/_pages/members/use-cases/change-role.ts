import type { MemberRole } from "@/entities/member";
import { memberQueries } from "@/entities/member";
import { assertCanChangeRole, type Requester } from "@/features/space/lib/assert-permission";

export const changeRoleUseCase = async (
  spaceId: string,
  targetUserId: number,
  newRole: MemberRole,
  requester: Requester,
): Promise<void> => {
  assertCanChangeRole(requester);

  // 마지막 manager 보호
  const allMembers = await memberQueries.findAllBySpaceId(spaceId);
  const targetMember = allMembers.find((m) => m.userId === targetUserId);
  if (targetMember?.role === "manager" && newRole !== "manager") {
    const managerCount = allMembers.filter((m) => m.role === "manager").length;
    if (managerCount <= 1) {
      throw new Error("최소 1명의 manager가 필요합니다.");
    }
  }

  await memberQueries.update(spaceId, targetUserId, { role: newRole });
};
