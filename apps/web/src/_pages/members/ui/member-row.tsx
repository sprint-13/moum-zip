"use client";

import { toast } from "@moum-zip/ui/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@moum-zip/ui/components/shadcn/dropdown-menu";
import { MoreHorizontal } from "@moum-zip/ui/icons";
import Image from "next/image";
import { useTransition } from "react";
import { changeRoleAction, kickMemberAction } from "@/_pages/members/action";
import type { Member, MemberRole } from "@/entities/member";
import { useSpaceContext } from "@/features/space";
import { cn } from "@/shared/lib/cn";

const ROLE_CONFIG: Record<MemberRole, { label: string; className: string }> = {
  manager: { label: "Manager", className: "bg-foreground text-background" },
  moderator: { label: "Moderator", className: "bg-muted text-foreground border border-border" },
  member: { label: "Member", className: "bg-muted/50 text-muted-foreground border border-border" },
};

export function MemberRow({ member }: { member: Member }) {
  const { space, membership } = useSpaceContext();
  const [isPending, startTransition] = useTransition();
  const role = ROLE_CONFIG[member.role];

  const canKick =
    (membership.role === "manager" || membership.role === "moderator") && membership.userId !== member.userId;
  const canChangeRole = membership.role === "manager";
  const showActions = canKick || canChangeRole;

  const handleKick = () => {
    startTransition(async () => {
      try {
        await kickMemberAction(space.slug, member.userId);
      } catch (error) {
        toast({ message: error instanceof Error ? error.message : "추방에 실패했습니다.", size: "small" });
      }
    });
  };

  const handleChangeRole = (newRole: MemberRole) => {
    startTransition(async () => {
      try {
        await changeRoleAction(space.slug, member.userId, newRole);
      } catch (error) {
        toast({ message: error instanceof Error ? error.message : "역할 변경에 실패했습니다.", size: "small" });
      }
    });
  };

  return (
    <div className="flex items-center border-[#e5e5e5] border-b last:border-0">
      {/* Member */}
      <div className="flex w-[220px] shrink-0 items-center gap-2.5 p-3">
        {member.avatarUrl ? (
          <Image
            src={member.avatarUrl}
            alt={member.nickname}
            width={32}
            height={32}
            className="shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground">
            <span className="font-semibold text-background text-xs">{member.nickname[0]?.toUpperCase()}</span>
          </div>
        )}
        <div className="flex flex-col gap-px">
          <span className="font-medium text-foreground text-sm">{member.nickname}</span>
          <span className="text-muted-foreground text-xs">{member.email}</span>
        </div>
      </div>

      {/* Role */}
      <div className="flex flex-1 items-center p-3">
        <span className={cn("rounded-full px-2.5 py-0.5 font-medium text-xs", role.className)}>{role.label}</span>
      </div>

      {/* Actions */}
      <div className="flex w-20 shrink-0 items-center justify-center p-3">
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${member.nickname} 멤버 액션 열기`}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canChangeRole && (
                <>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">역할 변경</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {(["manager", "moderator", "member"] as MemberRole[])
                        .filter((r) => r !== member.role)
                        .map((r) => (
                          <DropdownMenuItem
                            key={r}
                            className="text-xs"
                            onSelect={() => handleChangeRole(r)}
                            disabled={isPending}
                          >
                            {ROLE_CONFIG[r].label}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                </>
              )}
              {canKick && (
                <DropdownMenuItem className="text-xs" variant="destructive" onSelect={handleKick} disabled={isPending}>
                  추방
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
