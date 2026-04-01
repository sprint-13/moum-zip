import type { Member } from "@/entities/member";
import { memberQueries } from "@/entities/member";

const MEMBER_PAGE_SIZE = 8;

export interface GetSpaceMembersResult {
  members: Member[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchMemberList(spaceId: string, opts: { page?: number }): Promise<GetSpaceMembersResult> {
  const page = opts.page ?? 1;
  const offset = (page - 1) * MEMBER_PAGE_SIZE;

  const rows = await memberQueries.findManyBySpaceId(spaceId, {
    limit: MEMBER_PAGE_SIZE,
    offset,
  });

  const total = rows[0]?.total ?? 0;
  const members: Member[] = rows.map((data) => data.member);

  return {
    members,
    total,
    page,
    pageSize: MEMBER_PAGE_SIZE,
    totalPages: Math.ceil(total / MEMBER_PAGE_SIZE),
  };
}

/**
 * 스페이스 멤버 목록 조회 (Next.js Data Cache 적용).
 * 멤버 추가/제거 시 revalidateTag(`members-${spaceId}`)로 무효화한다.
 */
export function getSpaceMembersUseCase(spaceId: string, opts: { page?: number }): Promise<GetSpaceMembersResult> {
  return fetchMemberList(spaceId, opts);
}
