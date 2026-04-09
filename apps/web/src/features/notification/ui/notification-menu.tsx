"use client";

import { Bell } from "@moum-zip/ui/icons";
import { Dropdown, Sheet } from "@ui/components";
import { useEffect, useRef, useState } from "react";
import type { NotificationItem } from "@/entities/notification/model/types";
import { NotificationPanel } from "./notification-panel";

interface NotificationMenuProps {
  notifications: NotificationItem[];
}

export function NotificationMenu({ notifications }: NotificationMenuProps) {
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const prevIsDesktopRef = useRef<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const applyMode = (matches: boolean) => {
      const prev = prevIsDesktopRef.current;
      const modeChanged = prev !== null && prev !== matches;

      prevIsDesktopRef.current = matches;
      setIsDesktop(matches);

      if (modeChanged && open) {
        setOpen(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOpen(true);
          });
        });
      }
    };

    applyMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyMode(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [open]);

  const triggerButton = (
    <button
      type="button"
      aria-label="알림 열기"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
    >
      <Bell className="h-6 w-6 text-slate-600" />
      {unreadCount > 0 ? <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" /> : null}
    </button>
  );

  if (isDesktop) {
    return (
      <Dropdown key="desktop-notification-menu" open={open} onOpenChange={setOpen} modal={false}>
        <Dropdown.Trigger>{triggerButton}</Dropdown.Trigger>

        <Dropdown.Content align="end" sideOffset={10} className="w-[20rem] rounded-[24px] bg-white p-0 shadow-lg">
          <NotificationPanel notifications={notifications} />
        </Dropdown.Content>
      </Dropdown>
    );
  }

  return (
    <Sheet key="mobile-notification-menu" open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>{triggerButton}</Sheet.Trigger>

      <Sheet.Content side="right" className="h-dvh w-[min(100vw,20rem)] border-none p-0">
        <NotificationPanel notifications={notifications} isMobile />
      </Sheet.Content>
    </Sheet>
  );
}
