import { Download, type LucideIcon, Mail, UserPlus } from "@moum-zip/ui/icons";

//TODO: 기능 구현 필요
const ACTIONS: { label: string; Icon: LucideIcon }[] = [
  { label: "Invite New Member", Icon: UserPlus },
  { label: "Message All Members", Icon: Mail },
  { label: "Export Member List", Icon: Download },
];

export function QuickActionsCard() {
  return (
    <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-5">
      <span className="mb-1 block font-semibold text-base text-foreground">Quick Actions</span>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md border border-border bg-background px-4 py-2.5 font-medium text-foreground text-sm transition-colors hover:bg-muted"
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
