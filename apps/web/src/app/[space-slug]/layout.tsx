import type { ReactNode } from "react";
import { SpaceSidebar } from "@/_pages/space";

// TODO: 스페이스 별 기능을 동적으로 받아와서 컴포넌트를 생성해야함.
// -> 사이드바 메뉴 동적 생성
// -> 대시보드 페이지 콘텐츠도 동적 생성
// => layout에서 스페이스 별 기능을 받아와서 context로 내려주고, 사이드바와 대시보드 페이지에서 context를 사용해서 렌더링하는 방식으로 구현할 수 있을듯.

export default function SpaceLayout({ children }: { children: ReactNode }) {
  return (
    <SpaceSidebar>
      <main className="mx-auto w-full max-w-6xl p-6">{children}</main>
    </SpaceSidebar>
  );
}
