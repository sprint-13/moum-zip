"use client";

import { Calendar, FolderOpen, Newspaper, Users } from "@moum-zip/ui/icons";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSidebar } from "./sidebar";
import { SidebarItem } from "./sidebar-item";

const NAV_ITEMS: { label: string; path: string; icon: ReactNode }[] = [
  { label: "게시판", path: "bulletin", icon: <Newspaper /> },
  { label: "멤버", path: "members", icon: <Users /> },
  { label: "일정", path: "schedule", icon: <Calendar /> },
  { label: "자료", path: "files", icon: <FolderOpen /> },
];

export const SidebarContent = () => {
  const { open } = useSidebar();
  const { "space-slug": spaceSlug } = useParams<{ "space-slug": string }>();
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="my-4 h-[0.2px] w-full bg-primary/30" />
      {NAV_ITEMS.map(({ label, path, icon }) => {
        const href = `/${spaceSlug}/${path}`;
        return <SidebarItem key={path} href={href} label={label} icon={icon} active={pathname.startsWith(href)} />;
      })}
    </div>
  );
};
