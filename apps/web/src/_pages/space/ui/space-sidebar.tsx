import { Hexagon } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";
import { SidebarInset, SidebarPanel, SidebarProvider } from "./sidebar/sidebar";
import { SidebarContent } from "./sidebar/sidebar-content";
import { SidebarFooter } from "./sidebar/sidebar-footer";
import { SidebarHeader } from "./sidebar/sidebar-header";

export const SpaceSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <SidebarPanel>
        {/* TODO: 실제 스페이스 정보로 교체 필요 */}
        <SidebarHeader icon={<Hexagon />} title="Study Hub" description="스터디" />
        <SidebarContent />
        <div className="mt-auto">
          {/* TODO: 실제 유저 정보로 교체 필요 */}
          <SidebarFooter name="Jon Doe" email="joe@acmecorp.com" />
        </div>
      </SidebarPanel>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
