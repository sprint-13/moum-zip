import { captureException } from "@sentry/nextjs";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SpaceSection } from "@/_pages/spaces";
import { getSpaceListRemote } from "@/_pages/spaces/use-cases/get-space-list";
import { getQueryClient } from "@/shared/lib/get-query-client";

export async function SpaceSectionServer() {
  const queryClient = getQueryClient();

  await queryClient
    .prefetchInfiniteQuery({
      queryKey: ["space-list"],
      queryFn: ({ pageParam }) => getSpaceListRemote(pageParam as string | undefined),
      initialPageParam: undefined as string | undefined,
    })
    .catch((error: unknown) => {
      // 토큰 만료(Unauthorized)는 클라이언트 fetch로 조용히 폴백
      // 그 외 예상치 못한 에러는 Sentry에 기록
      if (error instanceof Error && error.message === "Unauthorized") return;
      captureException(error);
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpaceSection className="px-4" />
    </HydrationBoundary>
  );
}
