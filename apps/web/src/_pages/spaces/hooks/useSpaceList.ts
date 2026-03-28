import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import type { SpaceInfo } from "@/entities/spaces";

interface SpaceListPage {
  data: SpaceInfo[];
  nextCursor: string | null;
  hasMore: boolean;
}

async function fetchSpaceList(cursor?: string): Promise<SpaceListPage> {
  const url = cursor ? `/api/space-list?cursor=${cursor}` : `/api/space-list`;
  const res = await fetch(url);
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`스페이스 목록 조회 실패 (${res.status})`);

  return res.json();
}

export function useSpaceList() {
  return useSuspenseInfiniteQuery({
    queryKey: ["space-list"],
    queryFn: ({ pageParam }) => fetchSpaceList(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined),
  });
}
