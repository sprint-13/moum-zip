"use client";

import type { ReactNode } from "react";
import type { NotificationItem } from "@/entities/notification/model/types";
import { NotificationMenu } from "@/features/notification/ui/notification-menu";
import { SidebarTrigger, useSidebar } from "./sidebar";

interface SidebarHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  notifications: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const SidebarHeader = ({ icon, title, description, notifications, nextCursor, hasMore }: SidebarHeaderProps) => {
  const { open, setOpen } = useSidebar();

  const iconEl = (
    <div className="hidden size-8 shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground md:flex [&>svg]:size-4">
      {icon}
    </div>
  );

  if (!open) {
    return (
      <div className="hidden flex-col items-center gap-2 py-1 md:flex">
        <button type="button" onClick={() => setOpen(true)} className="py-1">
          {iconEl}
        </button>

        <NotificationMenu
          notifications={notifications}
          nextCursor={nextCursor}
          hasMore={hasMore}
          desktopSide="right"
          mobileVariant="dropdown"
        />
      </div>
    );
  }

  return (
    <div className="hidden flex-col gap-2 p-2 md:flex">
      <div className="flex justify-end">
        <SidebarTrigger />
      </div>

      <div className="flex items-center justify-between gap-2 rounded-md">
        <div className="flex min-w-0 items-center gap-2">
          {iconEl}
          <div className="flex min-w-0 flex-col justify-center">
            <span className="truncate font-medium text-foreground text-sm">{title}</span>
            {description && <span className="truncate text-foreground/70 text-xs">{description}</span>}
          </div>
        </div>

        <div className="shrink-0">
          <NotificationMenu
            notifications={notifications}
            nextCursor={nextCursor}
            hasMore={hasMore}
            desktopSide="right"
            mobileVariant="dropdown"
          />
        </div>
      </div>
    </div>
  );
};
