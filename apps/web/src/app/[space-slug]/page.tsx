import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";

// TODO: 스페이스 별 기능을 동적으로 받아와서 컴포넌트를 생성해야함.

export default function SpacePage() {
  return (
    <>
      <SpaceHeader title="Dashboard" description="dashboard" />
      <SpaceBody>
        <SpaceBodyLeft></SpaceBodyLeft>
        <SpaceBodyRight></SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
