import { and, count, eq } from "drizzle-orm";
import type { MemberRole } from "@/entities/member";
import { assertCanChangeRole, type Requester } from "@/features/space/lib/assert-permission";
import { db } from "@/shared/db";
import { spaceMembers } from "@/shared/db/scheme";

export const changeRoleUseCase = async (
  spaceId: string,
  targetUserId: number,
  newRole: MemberRole,
  requester: Requester,
): Promise<void> => {
  assertCanChangeRole(requester);

  await db.transaction(async (tx) => {
    const [target] = await tx
      .select()
      .from(spaceMembers)
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, targetUserId)));

    if (!target) throw new Error("멤버를 찾을 수 없습니다.");

    if (target.role === "manager" && newRole !== "manager") {
      const [{ managerCount }] = await tx
        .select({ managerCount: count() })
        .from(spaceMembers)
        .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.role, "manager")));

      if (managerCount <= 1) throw new Error("최소 1명의 manager가 필요합니다.");
    }

    await tx
      .update(spaceMembers)
      .set({ role: newRole })
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, targetUserId)));
  });
};
