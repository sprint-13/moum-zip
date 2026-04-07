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
  await memberQueries.update(spaceId, targetUserId, { role: newRole });
};
