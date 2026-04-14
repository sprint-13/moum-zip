import { SpaceHeader } from "@/_pages/spaces";
import { SpaceSection } from "./_components/space-section-client";

export default async function SpacePage() {
  return (
    <section className="mx-auto max-w-6xl font-pretendard">
      <SpaceHeader
        title="나의 스페이스"
        description="참여 중인 스페이스와 종료되어 아카이브된 스페이스를 확인하세요."
      />
      <SpaceSection className="px-4" />
    </section>
  );
}
