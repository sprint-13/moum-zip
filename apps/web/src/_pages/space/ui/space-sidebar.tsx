import { Calendar, FolderOpen, Hexagon, Newspaper, Users } from "@moum-zip/ui/icons";
import type { ComponentType, ReactNode } from "react";
import { MobileHeader } from "./sidebar/mobile-header";
import { MobileTabBar } from "./sidebar/mobile-tab-bar";
import { SidebarInset, SidebarPanel, SidebarProvider } from "./sidebar/sidebar";
import { SidebarContent } from "./sidebar/sidebar-content";
import { SidebarFooter } from "./sidebar/sidebar-footer";
import { SidebarHeader } from "./sidebar/sidebar-header";

export type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  Actions?: ComponentType;
};

// TODO: 실제 사용하는 기능들을 NAV_ITEM으로 변경 필요
const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", path: "", icon: <Hexagon /> },
  { label: "게시판", path: "/bulletin", icon: <Newspaper /> },
  { label: "멤버", path: "/members", icon: <Users /> },
  { label: "일정", path: "/schedule", icon: <Calendar /> },
  { label: "자료", path: "/files", icon: <FolderOpen /> },
];

export const SpaceSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      {/* 데스크탑: 고정 사이드바 */}
      <SidebarPanel>
        {/* TODO: 실제 스페이스 정보로 교체 필요 */}
        <SidebarHeader icon={<Hexagon />} title="Study Hub" description="스터디" />
        <SidebarContent navItems={NAV_ITEMS} />
        <div className="mt-auto">
          {/* TODO: 실제 유저 정보로 교체 필요 */}
          <SidebarFooter name="Jon Doe" email="joe@acmecorp.com" />
        </div>
      </SidebarPanel>

      {/* 메인 콘텐츠 영역 */}
      <SidebarInset>
        {/* 모바일 전용: 상단 헤더 + 탭 네비게이션 */}
        <MobileHeader navItems={NAV_ITEMS} />
        <MobileTabBar navItems={NAV_ITEMS} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};
