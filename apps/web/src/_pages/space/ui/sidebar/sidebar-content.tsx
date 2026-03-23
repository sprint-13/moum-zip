"use client";

import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSidebar } from "./sidebar";
import { SidebarItem } from "./sidebar-item";

interface SidebarContentProps {
  navItems: { label: string; path: string; icon: ReactNode }[];
}

export const SidebarContent = ({ navItems }: SidebarContentProps) => {
  const { open } = useSidebar();
  const { "space-slug": spaceSlug } = useParams<{ "space-slug": string }>();
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="my-4 h-[0.2px] w-full bg-primary/30" />
      {navItems.map(({ label, path, icon }) => {
        const href = `/${spaceSlug}/${path}`;
        return <SidebarItem key={path} href={href} label={label} icon={icon} active={pathname.startsWith(href)} />;
      })}
    </div>
  );
};
