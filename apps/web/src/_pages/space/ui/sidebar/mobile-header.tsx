"use client";

import { useParams, usePathname } from "next/navigation";
import type { NotificationItem } from "@/entities/notification/model/types";
import { NotificationMenu } from "@/features/notification/ui/notification-menu";
import type { NavItem } from "../space-sidebar";

interface MobileHeaderProps {
  navItems: NavItem[];
  notifications: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function MobileHeader({ navItems, notifications, nextCursor, hasMore }: MobileHeaderProps) {
  const { "space-slug": spaceSlug } = useParams<{ "space-slug": string }>();
  const pathname = usePathname();

  const current = navItems.find(({ path }) => {
    const href = path === "" ? `/${spaceSlug}` : `/${spaceSlug}/${path}`;
    return path === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  });
  const Actions = current?.Actions;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:hidden">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-foreground">{current?.label ?? "대시보드"}</span>
      </div>
      <div className="flex items-center gap-1">
        {Actions && <Actions />}
        <NotificationMenu
          notifications={notifications}
          nextCursor={nextCursor}
          hasMore={hasMore}
          mobileVariant="dropdown"
        />
      </div>
    </header>
  );
}
