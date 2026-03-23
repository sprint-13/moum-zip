import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/_pages/space";

// TODO: 스페이스 별 기능을 동적으로 받아와서 컴포넌트를 생성해야함.

export default function SpacePage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <SpaceHeader />
      <SpaceBody>
        <SpaceBodyLeft></SpaceBodyLeft>
        <SpaceBodyRight></SpaceBodyRight>
      </SpaceBody>
    </main>
  );
}
