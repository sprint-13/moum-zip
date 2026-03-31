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
export async function getPendingMembersRemote(meetingId: number): Promise<GetPendingMembersResult> {
  const api = await getApi();

  const { data } = await safe(api.meetings.participants.getList(meetingId, { size: 100 }), {
    default: () => {
      throw new Error("Failed to fetch pending members");
    },
  });

  const pendingMembers: PendingMember[] = data.data
    .filter((p) => p.joinedAt === null)
    .map((p) => ({
      userId: p.userId,
      name: p.user?.name ?? "Unknown",
      image: p.user?.image ?? null,
    }));

  return { pendingMembers };
}
