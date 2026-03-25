import { Shield, ShieldCheck, User } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";
import type { Member, MemberRole } from "@/entities/member";

const ROLE_CONFIG: { role: MemberRole; label: string; icon: ReactNode }[] = [
  { role: "manager", label: "Manager", icon: <Shield className="size-4" /> },
  { role: "moderator", label: "Moderator", icon: <ShieldCheck className="size-4" /> },
  { role: "member", label: "Member", icon: <User className="size-4" /> },
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
        {ROLE_CONFIG.map(({ role, label, icon }) => (
          <div key={role} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 font-medium text-foreground text-sm">
              {icon}
              {label}
            </div>
            <span className="text-muted-foreground text-sm">{counts[role]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
