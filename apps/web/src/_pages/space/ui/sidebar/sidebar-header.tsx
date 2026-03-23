"use client";

import type { ReactNode } from "react";
import { SidebarTrigger, useSidebar } from "./sidebar";

interface SidebarHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export const SidebarHeader = ({ icon, title, description }: SidebarHeaderProps) => {
  const { open, setOpen } = useSidebar();

  const iconEl = (
    <div className="hidden size-8 shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground md:flex [&>svg]:size-4">
      {icon}
    </div>
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="py-1">
        {iconEl}
      </button>
    );
  }

  return (
    <div className="hidden items-center justify-between rounded-md p-2 md:flex">
      <div className="flex items-center gap-2">
        {iconEl}
        <div className="flex flex-col justify-center">
          <span className="font-medium text-foreground text-sm">{title}</span>
          {description && <span className="text-foreground/70 text-xs">{description}</span>}
        </div>
      </div>
      <SidebarTrigger />
    </div>
  );
};
