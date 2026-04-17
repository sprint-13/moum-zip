import { and, count, eq } from "drizzle-orm";
import { assertCanKick, type Requester } from "@/features/space/lib/assert-permission";
import { db } from "@/shared/db";
import { spaceMembers } from "@/shared/db/scheme";

export const kickMemberUseCase = async (spaceId: string, targetUserId: number, requester: Requester): Promise<void> => {
  const [target] = await db
    .select()
    .from(spaceMembers)
    .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, targetUserId)));

  if (!target) throw new Error("멤버를 찾을 수 없습니다.");

  assertCanKick(requester, targetUserId, target.role);

  if (target.role === "manager") {
    const [{ managerCount }] = await db
      .select({ managerCount: count() })
      .from(spaceMembers)
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.role, "manager")));

    if (managerCount <= 1) throw new Error("최소 1명의 manager가 필요합니다.");
  }

  await db.delete(spaceMembers).where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, targetUserId)));
};
