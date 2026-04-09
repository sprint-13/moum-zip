import { memberQueries } from "@/entities/member";
import { assertCanKick, type Requester } from "@/features/space/lib/assert-permission";

export const kickMemberUseCase = async (spaceId: string, targetUserId: number, requester: Requester): Promise<void> => {
  const target = await memberQueries.getMember(spaceId, targetUserId);
  if (!target) throw new Error("멤버를 찾을 수 없습니다.");

  assertCanKick(requester, targetUserId, target.role);

  // 마지막 manager 보호
  if (target.role === "manager") {
    const allMembers = await memberQueries.findAllBySpaceId(spaceId);
    const managerCount = allMembers.filter((m) => m.role === "manager").length;
    if (managerCount <= 1) {
      throw new Error("최소 1명의 manager가 필요합니다.");
    }
  }

  await memberQueries.remove(spaceId, targetUserId);
};
