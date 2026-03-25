import type { Member } from "@/entities/member";
import { ROLE_LABEL } from "@/entities/member";

export function OnlineNowCard({ members }: { members: Member[] }) {
  return (
    <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-5">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold text-base text-foreground">Members</span>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground text-xs">{members.length} </span>
        </div>
      </div>
      <div className="flex flex-col">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-2.5 py-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground">
              <span className="font-semibold text-[10px] text-background">user image</span>
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">{m.nickname}</span>
            {m.role !== "member" && (
              <span className="rounded-full bg-foreground px-2 py-0.5 font-medium text-[10px] text-background">
                {ROLE_LABEL[m.role]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
