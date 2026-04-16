import { Suspense } from "react";
import { SpaceHeader } from "@/_pages/spaces";
import { SpaceSectionServer } from "./_components/space-section-server";

export default function SpacePage() {
  return (
    <section className="mx-auto max-w-6xl font-pretendard">
      <SpaceHeader
        title="나의 스페이스"
        description="참여 중인 스페이스와 종료되어 아카이브된 스페이스를 확인하세요."
      />
      <Suspense>
        <SpaceSectionServer />
      </Suspense>
    </section>
  );
}
