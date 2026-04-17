import { cacheLife, cacheTag } from "next/cache";
import type { Member } from "@/entities/member";
import { memberQueries } from "@/entities/member";
import { CACHE_TAGS } from "@/shared/lib/cache";

const MEMBER_PAGE_SIZE = 8;

export interface GetSpaceMembersResult {
  members: Member[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 스페이스 멤버 목록 조회 (Next.js Data Cache 적용).
 * 멤버 추가/제거 시 updateTag(`members-${spaceId}`)로 무효화한다.
 * currentUserId 전달 시 본인을 멤버 목록 최상단에 고정한다.
 */
export async function getSpaceMembersUseCase(
  spaceId: string,
  opts: { page?: number; currentUserId?: number },
): Promise<GetSpaceMembersResult> {
  const { members, total, page, pageSize, totalPages } = await fetchMembers(spaceId, opts.page, opts.currentUserId);
  return { members, total, page, pageSize, totalPages };
}

async function fetchMembers(spaceId: string, currentPage?: number, currentUserId?: number) {
  "use cache";
  cacheTag(CACHE_TAGS.members(spaceId));
  cacheLife("days");

  const page = currentPage ?? 1;
  const offset = (page - 1) * MEMBER_PAGE_SIZE;

  const rows = await memberQueries.findManyBySpaceId(spaceId, {
    limit: MEMBER_PAGE_SIZE,
    offset,
    currentUserId,
  });

  const total = rows[0]?.total ?? 0;
  const members: Member[] = rows.map((data) => data.member);
  return { members, total, page, pageSize: MEMBER_PAGE_SIZE, totalPages: Math.ceil(total / MEMBER_PAGE_SIZE) };
}
