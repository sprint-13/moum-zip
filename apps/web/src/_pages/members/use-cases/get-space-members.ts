import { unstable_cache } from "next/cache";
import type { Member } from "@/entities/member";
import { getSpaceMembers as querySpaceMembers } from "@/entities/member/queries";

export interface GetSpaceMembersResult {
  members: Member[];
  total: number;
}

/**
 * 스페이스 멤버 목록 조회 (Next.js Data Cache 적용).
 * 멤버 추가/제거 시 revalidateTag(`members-${spaceId}`)로 무효화한다.
 */
export function getSpaceMembersUseCase(spaceId: string): Promise<GetSpaceMembersResult> {
  return unstable_cache(
    async () => {
      const rows = await querySpaceMembers(spaceId);
      return { members: rows, total: rows.length };
    },
    ["space-members", spaceId],
    { tags: [`members-${spaceId}`], revalidate: 60 },
  )();
}
