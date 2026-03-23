import { Calendar, FolderOpen, Hexagon, Newspaper, Users } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";
import { SidebarInset, SidebarPanel, SidebarProvider } from "./sidebar/sidebar";
import { SidebarContent } from "./sidebar/sidebar-content";
import { SidebarFooter } from "./sidebar/sidebar-footer";
import { SidebarHeader } from "./sidebar/sidebar-header";

const NAV_ITEMS: { label: string; path: string; icon: ReactNode }[] = [
  { label: "게시판", path: "bulletin", icon: <Newspaper /> },
  { label: "멤버", path: "members", icon: <Users /> },
  { label: "일정", path: "schedule", icon: <Calendar /> },
  { label: "자료", path: "files", icon: <FolderOpen /> },
];

export const SpaceSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <SidebarPanel>
        {/* TODO: 실제 스페이스 정보로 교체 필요 */}
        <SidebarHeader icon={<Hexagon />} title="Study Hub" description="스터디" />
        {/* TODO: 실제 사용하는 기능들을 NAV_ITEM으로 변경 필요 */}
        <SidebarContent navItems={NAV_ITEMS} />
        <div className="mt-auto">
          {/* TODO: 실제 유저 정보로 교체 필요 */}
          <SidebarFooter name="Jon Doe" email="joe@acmecorp.com" />
        </div>
      </SidebarPanel>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
