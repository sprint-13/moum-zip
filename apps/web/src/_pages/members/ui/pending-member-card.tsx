"use client";

import { useState, useTransition } from "react";

interface PendingMember {
  userId: number;
  name: string;
  image: string | null;
}

interface PendingMemberCardProps {
  pendingMembers: PendingMember[];
  onAccept: (member: { userId: number; name: string; image: string }) => Promise<void>;
}

const ParticipantRow = ({
  member,
  onAccept,
  onReject,
}: {
  member: PendingMember;
  onAccept: (member: { userId: number; name: string; image: string }) => Promise<void>;
  onReject: (userId: number) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      await onAccept({ ...member, image: member.image ?? "" });
    });
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground">
        <span className="font-semibold text-[11px] text-background">{member.name[0]?.toUpperCase()}</span>
      </div>
      <div className="font-medium text-foreground text-sm">{member.name}</div>
      <div>
        <button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          className="rounded px-2 py-1 text-primary text-xs transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          수락
        </button>
        <button
          type="button"
          onClick={() => onReject(member.userId)}
          disabled={isPending}
          className="rounded px-2 py-1 text-red-400 text-xs transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          거절
        </button>
      </div>
    </div>
  );
};

export function PendingMemberCard({ pendingMembers, onAccept }: PendingMemberCardProps) {
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());
  const [acceptedIds, setAcceptedIds] = useState<Set<number>>(new Set());

  const handleAccept = async (member: { userId: number; name: string; image: string }) => {
    await onAccept(member);
    setAcceptedIds((prev) => new Set(prev).add(member.userId));
  };

  // TODO: 현재는 임시상태. 결국 pending member 관리도 neon db에서 수행해야 한다.
  const handleReject = (userId: number) => {
    setRejectedIds((prev) => new Set(prev).add(userId));
  };

  const visible = pendingMembers.filter((m) => !rejectedIds.has(m.userId) && !acceptedIds.has(m.userId));

  if (visible.length === 0) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-background p-5">
      <span className="mb-1 block font-semibold text-base text-foreground">참가를 요청한 사용자</span>
      <div className="flex flex-col gap-2">
        {visible.map((member) => (
          <ParticipantRow key={member.userId} member={member} onAccept={handleAccept} onReject={handleReject} />
        ))}
      </div>
    </div>
  );
}
