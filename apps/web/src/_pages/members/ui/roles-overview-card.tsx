import { type LucideIcon, Shield, ShieldCheck, User } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";
import type { Member, MemberRole } from "@/entities/member";

const ROLE_CONFIG: { role: MemberRole; label: string; Icon: LucideIcon }[] = [
  { role: "manager", label: "Manager", Icon: Shield },
  { role: "moderator", label: "Moderator", Icon: ShieldCheck },
  { role: "member", label: "Member", Icon: User },
];

export function RolesOverviewCard({ members }: { members: Member[] }) {
  const counts = members.reduce<Record<MemberRole, number>>(
    (acc, m) => ({ ...acc, [m.role]: (acc[m.role] ?? 0) + 1 }),
    { manager: 0, moderator: 0, member: 0 },
  );

  return (
    <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-5">
      <span className="mb-1 block font-semibold text-base text-foreground">Roles Overview</span>
      <div className="flex flex-col">
        {ROLE_CONFIG.map(({ role, label, Icon }) => (
          <div key={role} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 font-medium text-foreground text-sm">
              <Icon className="size-4" />
              {label}
            </div>
            <span className="text-muted-foreground text-sm">{counts[role]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
