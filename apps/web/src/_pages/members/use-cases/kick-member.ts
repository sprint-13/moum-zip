import { memberQueries } from "@/entities/member";
import { assertCanKick, type Requester } from "@/features/space/lib/assert-permission";

export const kickMemberUseCase = async (spaceId: string, targetUserId: number, requester: Requester): Promise<void> => {
  const target = await memberQueries.getMember(spaceId, targetUserId);
  if (!target) throw new Error("멤버를 찾을 수 없습니다.");

  assertCanKick(requester, targetUserId, target.role);
  await memberQueries.remove(spaceId, targetUserId);
};
