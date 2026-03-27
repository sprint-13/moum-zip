import type { ReactNode } from "react";
import { SpaceSidebar } from "@/_pages/space";
import { getSpaceInfoRemote } from "@/features/space/use-cases/get-space-info";

// layout에서 인증·스페이스·멤버십 검증을 수행한다.
// getSpaceBySlug, getSpaceMembership에 React.cache()가 적용되어 있으므로
// 하위 page.tsx에서 getSpaceContext를 다시 호출해도 DB 쿼리는 요청당 1회만 실행된다.
export default async function SpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ "space-slug": string }>;
}) {
  const slug = (await params)["space-slug"];
  const space = await getSpaceInfoRemote(slug);

  return (
    <SpaceSidebar space={space} membership={membership}>
      <main className="mx-auto w-full max-w-6xl p-6">{children}</main>
    </SpaceSidebar>
  );
}
