import { Download, Mail, UserPlus } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";

const ACTIONS: { label: string; icon: ReactNode }[] = [
  { label: "Invite New Member", icon: <UserPlus className="size-4" /> },
  { label: "Message All Members", icon: <Mail className="size-4" /> },
  { label: "Export Member List", icon: <Download className="size-4" /> },
];

export function QuickActionsCard() {
  return (
    <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-5">
      <span className="mb-1 block font-semibold text-base text-foreground">Quick Actions</span>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md border border-border bg-background px-4 py-2.5 font-medium text-foreground text-sm transition-colors hover:bg-muted"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
