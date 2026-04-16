import { LoadingIndicator, Toaster } from "@moum-zip/ui/components";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { SpaceSidebar } from "@/_pages/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { SpaceProvider } from "@/features/space/lib/space-context-provider";
import Logo from "@/shared/assets/moum-zip-logo.svg";
import { handleAppError } from "@/shared/lib/handle-app-error";
import { QueryProvider } from "@/shared/providers/query-client-provider";

function SpaceLayoutLoading() {
  return (
    <div className="flex min-h-svh animate-fade-in-delayed flex-col items-center justify-center gap-6">
      <Logo width={120} height={50} />
      <LoadingIndicator text="" />
    </div>
  );
}

// layout에서 인증·스페이스·멤버십 검증을 수행한다.
// getSpaceBySlug, getSpaceMembership에 React.cache()가 적용되어 있으므로
// 하위 page.tsx에서 getSpaceContext를 다시 호출해도 DB 쿼리는 요청당 1회만 실행된다.
async function SpaceLayoutContent({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ "space-slug": string }>;
}) {
  const slug = (await params)["space-slug"];

  const { space, membership } = await getSpaceContext(slug).catch(handleAppError);

  return (
    <SpaceProvider value={{ space, membership }}>
      <SpaceSidebar space={space} membership={membership}>
        <main className={`mx-auto w-full max-w-6xl p-6`}>{children}</main>
      </SpaceSidebar>
    </SpaceProvider>
  );
}

export default function SpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ "space-slug": string }>;
}) {
  return (
    <QueryProvider>
      <Suspense fallback={<SpaceLayoutLoading />}>
        <SpaceLayoutContent params={params}>{children}</SpaceLayoutContent>
      </Suspense>
      <Toaster />
    </QueryProvider>
  );
}
