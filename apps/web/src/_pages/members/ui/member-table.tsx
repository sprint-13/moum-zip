"use client";

import { Pagination } from "@moum-zip/ui/components";
import { useSpaceContext } from "@/features/space";
import { usePaginationUrl } from "@/shared/hooks/use-pagination-url";
import { useMemberList } from "../hooks/use-member-list";
import { MemberRow } from "./member-row";

export function MemberTable() {
  const { space } = useSpaceContext();
  const { page, setPage } = usePaginationUrl();

  const { data } = useMemberList(space.spaceId, { page });

  return (
    <div className="flex flex-col">
      {/* Search Row */}
      <div className="flex items-center gap-3"></div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        {/* Card Header */}
        <div className="flex items-center justify-between border-border border-b px-5 py-4">
          <span className="font-semibold text-base text-foreground">All Members</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-muted-foreground text-xs">
            {data.total} members
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
        {data.members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}

        {/* 페이지네이션 */}
        {data.totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <Pagination
              ariaLabel="멤버 페이지네이션"
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              previousAriaLabel="이전 페이지"
              nextAriaLabel="다음 페이지"
              size="responsive"
            />
          </div>
        )}
      </div>
    </div>
  );
}
