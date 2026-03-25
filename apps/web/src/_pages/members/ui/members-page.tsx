import { Mail, UserPlus } from "@moum-zip/ui/icons";
import type { Member } from "@/entities/member";
import { MemberTable } from "./member-table";
import { OnlineNowCard } from "./online-now-card";
import { QuickActionsCard } from "./quick-actions-card";
import { RolesOverviewCard } from "./roles-overview-card";

export function MembersPage({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Top Bar */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-[28px] text-foreground">Members</h1>
          <p className="text-muted-foreground text-sm">Manage your study group members, roles, and participation.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
          >
            <UserPlus className="size-4" />
            Invite Member
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
          >
            <Mail className="size-4" />
            Send Message
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-5">
        {/* Left: Table */}
        <div className="min-w-0 flex-1">
          <MemberTable members={members} />
        </div>

        {/* Right: Side Cards */}
        <div className="flex w-[360px] shrink-0 flex-col gap-4">
          <OnlineNowCard members={members} />
          <RolesOverviewCard members={members} />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
