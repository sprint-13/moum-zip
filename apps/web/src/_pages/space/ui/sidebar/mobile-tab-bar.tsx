"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface MobileTabBarProps {
  navItems: { label: string; path: string; icon: ReactNode }[];
}

export function MobileTabBar({ navItems }: MobileTabBarProps) {
  const { "space-slug": spaceSlug } = useParams<{ "space-slug": string }>();
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar flex h-11 shrink-0 justify-around gap-4 overflow-x-scroll border-b bg-card md:hidden">
      {navItems.map(({ label, path, icon }) => {
        const href = `/${spaceSlug}${path}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={path}
            href={href}
            className={cn(
              "flex shrink-0 items-center justify-center gap-1.5 border-b-2 text-sm",
              active
                ? "border-primary font-semibold text-primary"
                : "border-transparent font-medium text-muted-foreground",
            )}
          >
            <span className="[&>svg]:size-4">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
