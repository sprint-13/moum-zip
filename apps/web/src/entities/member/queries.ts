import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/shared/db";
import type { NewMember } from "@/shared/db/scheme";
import { spaceMembers } from "@/shared/db/scheme";

// TODO: spaceId를 curry function 형태로 넘겨도 될 듯

export const memberQueries = {
  findAllBySpaceId: async (spaceId: string) => {
    return db.select().from(spaceMembers).where(eq(spaceMembers.spaceId, spaceId)).orderBy(
      desc(spaceMembers.role), // 관리자 우선
      sql`${spaceMembers.nickname} ASC`, // 닉네임 가나다순
    );
  },
  findUserIdsBySpaceId: async (spaceId: string) => {
    return db.select({ userId: spaceMembers.userId }).from(spaceMembers).where(eq(spaceMembers.spaceId, spaceId));
  },
  findManyBySpaceId: async (spaceId: string, opts?: { limit?: number; offset?: number }) => {
    return db
      .select({
        member: spaceMembers,
        total: sql<number>`COUNT(*) OVER()`.mapWith(Number),
      })
      .from(spaceMembers)
      .where(eq(spaceMembers.spaceId, spaceId))
      .orderBy(desc(spaceMembers.role)) // TODO 정렬 방식 명시하기
      .limit(opts?.limit ?? 10)
      .offset(opts?.offset ?? 0);
  },
  getMember: async (spaceId: string, userId: number) => {
    const [member] = await db
      .select()
      .from(spaceMembers)
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)));
    return member || null;
  },
  create: async (data: NewMember) => {
    const [newMember] = await db.insert(spaceMembers).values(data).returning();
    return newMember;
  },
  createMany: async (data: NewMember[]) => {
    return await db.insert(spaceMembers).values(data).returning();
  },
  update: async (
    spaceId: string,
    userId: number,
    partialData: Partial<Pick<NewMember, "nickname" | "role" | "email" | "avatarUrl">>,
  ) => {
    const [updatedMember] = await db
      .update(spaceMembers)
      .set(partialData)
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)))
      .returning();
    return updatedMember;
  },
  remove: async (spaceId: string, userId: number) => {
    const [deletedMember] = await db
      .delete(spaceMembers)
      .where(and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)))
      .returning();
    return deletedMember; // 삭제된 데이터 확인용
  },
};
