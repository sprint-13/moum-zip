import { memberQueries } from "@/entities/member";
import { assertCanKick, type Requester } from "@/features/space/lib/assert-permission";

export const kickMemberUseCase = async (spaceId: string, targetUserId: number, requester: Requester): Promise<void> => {
  assertCanKick(requester);
  await memberQueries.remove(spaceId, targetUserId);
};
