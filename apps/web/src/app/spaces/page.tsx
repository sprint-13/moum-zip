import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { SpaceHeader, SpaceSection } from "@/_pages/spaces";
import { getSpaceList } from "@/_pages/spaces/use-cases/get-space-list";
import { getQueryClient } from "@/shared/lib/get-query-client";

const Loading = () => (
  <div className="flex h-48 items-center justify-center">
    <span className="text-gray-500">스페이스 목록을 불러오는 중...</span>
  </div>
);

export default async function SpacePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["space-list"],
    queryFn: ({ pageParam }) => getSpaceList(pageParam as string | undefined),
    initialPageParam: undefined,
  });

  return (
    <main className="mx-auto max-w-6xl font-pretendard">
      <SpaceHeader title="나의 스페이스" description="참여 중인 스터디와 프로젝트의 현황을 한눈에 확인하세요." />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <SpaceSection className="px-4" />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
