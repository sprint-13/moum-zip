"use client";

import { ChevronsUpDown } from "@moum-zip/ui/icons";
import Image from "next/image";
import { useSidebar } from "./sidebar";

interface SidebarFooterProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const SidebarFooter = ({ name, email, avatarUrl }: SidebarFooterProps) => {
  const { open, setOpen } = useSidebar();

  const avatar = (
    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="40px" />
      ) : (
        <span className="font-semibold text-background text-sm">{getInitials(name)}</span>
      )}
    </div>
  );

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="py-1">
        {avatar}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-muted/30 p-2">
      <div className="flex items-center gap-2">
        {avatar}
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{name}</span>
          <span className="text-foreground/70 text-xs">{email}</span>
        </div>
      </div>
      <ChevronsUpDown className="size-4 text-muted-foreground" />
    </div>
  );
};
