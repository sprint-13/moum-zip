import { getSpaceMembersUseCase } from "../use-cases/get-space-members";
import { MemberPagination } from "./member-pagination";
import { MemberRow } from "./member-row";

interface MemberTableProps {
  spaceId: string;
  page: number;
  currentUserId: number;
}

export async function MemberTable({ spaceId, page, currentUserId }: MemberTableProps) {
  const data = await getSpaceMembersUseCase(spaceId, { page, currentUserId });

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
          <div className="w-20 shrink-0 p-3 text-center font-medium text-muted-foreground text-xs">Actions</div>
        </div>

        {/* Rows */}
        {data.members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}

        {/* 페이지네이션 */}
        {data.totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <MemberPagination currentPage={data.page} totalPages={data.totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
