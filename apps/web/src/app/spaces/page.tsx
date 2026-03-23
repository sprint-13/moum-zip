import { SpaceHeader, SpaceSection } from "@/_pages/spaces";
import { MOCK_SPACE } from "./_mock";

export default function SpacePage() {
  return (
    <main className="mx-auto max-w-6xl font-pretendard">
      <SpaceHeader title="나의 스페이스" description="참여 중인 스터디와 프로젝트의 현황을 한눈에 확인하세요." />
      <SpaceSection spaces={MOCK_SPACE} className="px-4" />
    </main>
  );
}
