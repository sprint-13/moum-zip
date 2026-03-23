"use client";

import { Sheet } from "@moum-zip/ui/components";
import { PanelLeft } from "@moum-zip/ui/icons";
import { createContext, type HTMLAttributes, type ReactNode, useContext, useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";

// ------------------------------------------------------------------ constants

const SIDEBAR_WIDTH = "260px";
const MOBILE_BREAKPOINT = 1024; // lg

// ------------------------------------------------------------------ context

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      // 모바일 전환 시 사이드바 닫기
      if (e.matches) setOpen(false);
    };
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <SidebarContext value={{ open, setOpen, isMobile }}>
      <div style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties} className="flex min-h-svh w-full">
        {children}
      </div>
    </SidebarContext>
  );
}

// ------------------------------------------------------------------ Panel (사이드바 본체)

type SidebarPanelProps = HTMLAttributes<HTMLElement>;

function SidebarPanel({ children, className }: SidebarPanelProps) {
  const { open, setOpen, isMobile } = useSidebar();

  // 모바일: Sheet로 오버레이
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content side="left" className="w-(--sidebar-width) p-0">
          <nav className="flex h-full flex-col">{children}</nav>
        </Sheet.Content>
      </Sheet>
    );
  }

  // 데스크톱: 고정 사이드바
  return (
    <aside
      className={cn(
        "hidden h-svh flex-col border-r bg-sidebar py-4 transition-[width] duration-200 lg:flex",
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
