import { useSuspenseQuery } from "@tanstack/react-query";
import { memberQueryKeys } from "../model/query-keys";
import type { GetSpaceMembersResult } from "../use-cases/get-space-members";

async function fetchMemberList(slug: string, opts: { page: number }): Promise<GetSpaceMembersResult> {
  const params = new URLSearchParams({ page: String(opts.page) });

  const res = await fetch(`/api/spaces/${slug}/members?${params.toString()}`);
  if (!res.ok) throw new Error("멤버 리스트를 불러오지 못했습니다.");
  return res.json();
}

export const useMemberList = (slug: string, opts: { page: number }) => {
  return useSuspenseQuery({
    queryKey: memberQueryKeys.list(slug, opts),
    queryFn: () => fetchMemberList(slug, opts),
  });
};
