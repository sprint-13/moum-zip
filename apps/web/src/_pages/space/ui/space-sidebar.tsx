import { Calendar, Hexagon, Newspaper, Users } from "@moum-zip/ui/icons";
import type { ComponentType, ReactNode } from "react";
import { getNotifications } from "@/features/notification/use-cases/get-notifications";
import type { SpaceContext } from "@/features/space/lib/get-space-context";
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

const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", path: "", icon: <Hexagon /> },
  { label: "게시판", path: "bulletin", icon: <Newspaper /> },
  { label: "멤버", path: "members", icon: <Users /> },
  { label: "일정", path: "schedule", icon: <Calendar /> },
  // { label: "자료", path: "files", icon: <FolderOpen /> },
];

interface SpaceSidebarProps {
  children: ReactNode;
  space: SpaceContext["space"];
  membership: SpaceContext["membership"];
}

export const SpaceSidebar = async ({ children, space, membership }: SpaceSidebarProps) => {
  const {
    data: notifications,
    nextCursor,
    hasMore,
  } = await getNotifications({
    size: 10,
  });

  return (
    <SidebarProvider>
      {/* 데스크탑: 고정 사이드바 */}
      <SidebarPanel>
        <SidebarHeader
          icon={<Hexagon />}
          title={space.name}
          description={space.type}
          notifications={notifications}
          nextCursor={nextCursor}
          hasMore={hasMore}
        />
        <SidebarContent navItems={NAV_ITEMS} />
        <div className="mt-auto">
          <SidebarFooter
            slug={space.slug}
            name={membership.nickname}
            email={membership.email ?? ""}
            avatarUrl={membership.avatarUrl ?? undefined}
          />
        </div>
      </SidebarPanel>

      {/* 메인 콘텐츠 영역 */}
      <SidebarInset>
        {/* 모바일 전용: 상단 헤더 + 탭 네비게이션 */}
        <div className="flex min-h-svh flex-1 flex-col">
          <MobileHeader navItems={NAV_ITEMS} notifications={notifications} nextCursor={nextCursor} hasMore={hasMore} />
          <MobileTabBar navItems={NAV_ITEMS} />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
