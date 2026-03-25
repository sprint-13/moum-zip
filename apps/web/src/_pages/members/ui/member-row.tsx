import { MoreHorizontal } from "@moum-zip/ui/icons";
import type { Member, MemberRole } from "@/entities/member";
import { cn } from "@/shared/lib/cn";

const ROLE_CONFIG: Record<MemberRole, { label: string; className: string }> = {
  manager: { label: "Manager", className: "bg-foreground text-background" },
  moderator: { label: "Moderator", className: "bg-muted text-foreground border border-border" },
  member: { label: "Member", className: "bg-muted/50 text-muted-foreground border border-border" },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function MemberRow({ member }: { member: Member }) {
  const role = ROLE_CONFIG[member.role];

  return (
    <div className="flex items-center border-[#e5e5e5] border-b last:border-0">
      {/* Member */}
      <div className="flex w-[220px] shrink-0 items-center gap-2.5 p-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground">
          <span className="font-semibold text-background text-xs">{getInitials(member.nickname)}</span>
        </div>
        <div className="flex flex-col gap-px">
          <span className="font-medium text-foreground text-sm">{member.nickname}</span>
          <span className="text-muted-foreground text-xs">{member.email}</span>
        </div>
      </div>

      {/* Role */}
      <div className="flex flex-1 items-center p-3">
        <span className={cn("rounded-full px-2.5 py-0.5 font-medium text-xs", role.className)}>{role.label}</span>
      </div>

      {/* Status */}
      <div className="flex w-[120px] shrink-0 items-center gap-1.5 p-3">
        {/* <span className={cn("size-2 rounded-full", member === "online" ? "bg-green-500" : "bg-neutral-400")} />
        <span className="text-foreground text-sm">{member === "online" ? "Online" : "Offline"}</span> */}
      </div>

      {/* Actions */}
      <div className="flex w-20 shrink-0 items-center justify-center p-3">
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}
