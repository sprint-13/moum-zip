"use client";

import { PanelLeft } from "@moum-zip/ui/icons";
import { createContext, type HTMLAttributes, type ReactNode, useContext, useState } from "react";
import { cn } from "@/shared/lib/cn";

// ------------------------------------------------------------------ constants

const SIDEBAR_WIDTH = "260px";

// ------------------------------------------------------------------ context

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SpaceSidebar.Provider");
  return ctx;
}

// ------------------------------------------------------------------ Provider

type SidebarProviderProps = {
  children: ReactNode;
  defaultOpen?: boolean;
};

function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SidebarContext value={{ open, setOpen }}>
      <div style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties} className="flex min-h-svh w-full">
        {children}
      </div>
    </SidebarContext>
  );
}

// ------------------------------------------------------------------ Panel (사이드바 본체)

type SidebarPanelProps = HTMLAttributes<HTMLElement>;

function SidebarPanel({ children, className }: SidebarPanelProps) {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden h-svh flex-col border-r bg-sidebar py-4 transition-[width] duration-200 md:flex",
        open ? "w-(--sidebar-width) px-4" : "w-14 px-2",
        className,
      )}
    >
      <nav className={cn("flex h-full flex-col", !open && "items-center")}>{children}</nav>
    </aside>
  );
}

// ------------------------------------------------------------------ Inset (메인 콘텐츠 영역)

type SidebarInsetProps = HTMLAttributes<HTMLElement>;

function SidebarInset({ children, className }: SidebarInsetProps) {
  return <main className={cn("flex min-h-svh flex-1 flex-col overflow-hidden", className)}>{children}</main>;
}

// ------------------------------------------------------------------ Trigger

type SidebarTriggerProps = {
  className?: string;
};

function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label={open ? "사이드바 닫기" : "사이드바 열기"}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <PanelLeft className="size-4" />
    </button>
  );
}
// ------------------------------------------------------------------ export
export { SidebarPanel, SidebarInset, SidebarTrigger, SidebarProvider };
