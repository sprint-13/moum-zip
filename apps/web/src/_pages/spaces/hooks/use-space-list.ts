import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { SpaceInfo } from "@/entities/spaces";

interface SpaceListPage {
  data: SpaceInfo[];
  nextCursor: string | null;
  hasMore: boolean;
}

async function fetchSpaceList(cursor?: string): Promise<SpaceListPage> {
  const url = cursor ? `/api/space-list?cursor=${cursor}` : `/api/space-list`;
  const res = await fetch(url);
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
