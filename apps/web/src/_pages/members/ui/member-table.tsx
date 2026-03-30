"use client";

import { useDeferredValue, useState } from "react";
import type { Member } from "@/entities/member";
import { MemberRow } from "./member-row";

export function MemberTable({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = members.filter(
    (m) => deferredQuery.length === 0 || m.nickname.toLowerCase().includes(deferredQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <label htmlFor="member-search" className="sr-only">
          멤버 검색
        </label>
        <input
          id="member-search"
          type="text"
          placeholder="Search members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        {/* Card Header */}
        <div className="flex items-center justify-between border-border border-b px-5 py-4">
          <span className="font-semibold text-base text-foreground">All Members</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-muted-foreground text-xs">
            {members.length} members
          </span>
        </div>

        {/* Table Header */}
        <div className="flex border-border border-b bg-primary/10">
          <div className="w-[220px] shrink-0 p-3 font-medium text-muted-foreground text-xs">Member</div>
          <div className="flex-1 p-3 font-medium text-muted-foreground text-xs">Role</div>
          <div className="w-[120px] shrink-0 p-3 font-medium text-muted-foreground text-xs">Status</div>
          <div className="w-20 shrink-0 p-3 text-center font-medium text-muted-foreground text-xs">Actions</div>
        </div>

        {/* Rows */}
        {filtered.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
