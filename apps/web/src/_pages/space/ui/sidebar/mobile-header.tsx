"use client";

import { Bell } from "@moum-zip/ui/icons";
import { useParams, usePathname } from "next/navigation";
import type { NavItem } from "../space-sidebar";

interface MobileHeaderProps {
  navItems: NavItem[];
}

export function MobileHeader({ navItems }: MobileHeaderProps) {
  const { "space-slug": spaceSlug } = useParams<{ "space-slug": string }>();
  const pathname = usePathname();

  const current = navItems.find(({ path }) => pathname.startsWith(`/${spaceSlug}/${path}`));

  const Actions = current?.Actions;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:hidden">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-foreground">{current?.label ?? "대시보드"}</span>
      </div>
      <div className="flex items-center gap-1">
        {Actions && <Actions />}
        <button
          type="button"
          aria-label="알림"
          className="flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
        >
          <Bell className="size-5" />
        </button>
      </div>
    </header>
  );
}
