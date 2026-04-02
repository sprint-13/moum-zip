import { memberQueries } from "@/entities/member";
import { getApi } from "@/shared/api/server";
import { safe } from "@/shared/lib/safe";

export interface PendingMember {
  userId: number;
  name: string;
  image: string | null;
}

export interface GetPendingMembersResult {
  pendingMembers: PendingMember[];
}

/**
 * 스페이스(미팅)의 대기 중인 참가자 목록 조회.
 * joinedAt이 null인 참가자를 대기 중으로 간주한다.
 */
export async function getPendingMembersUseCase(spaceId: string): Promise<GetPendingMembersResult> {
  const api = await getApi();

  const { data } = await safe(api.meetings.participants.getList(Number(spaceId), { size: 20 }), {
    default: () => {
      throw new Error("Failed to fetch pending members");
    },
  });

  const participants = data.data;

  const members = await memberQueries.findUserIdsBySpaceId(spaceId);
  const memberUserIdSet = new Set(members.map((m) => m.userId));

  const pendingMembers: PendingMember[] = participants
    .filter((p) => !memberUserIdSet.has(p.userId))
    .map((p) => ({
      userId: p.userId,
      name: p.user?.name ?? "Unknown",
      image: p.user?.image ?? null,
    }));

  return { pendingMembers };
}
