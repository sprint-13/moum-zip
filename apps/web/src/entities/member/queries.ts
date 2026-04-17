import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/shared/db";
import type { NewMember } from "@/shared/db/scheme";
import { spaceMembers } from "@/shared/db/scheme";
import { CACHE_TAGS } from "@/shared/lib/cache";

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
  findManyBySpaceId: async (
    spaceId: string,
    opts?: { limit?: number; offset?: number; currentUserId?: number }, // 👈 currentUserId 추가
  ) => {
    const { limit = 10, offset = 0, currentUserId } = opts ?? {};

    return db
      .select({
        member: spaceMembers,
        total: sql<number>`COUNT(*) OVER()`.mapWith(Number),
      })
      .from(spaceMembers)
      .where(eq(spaceMembers.spaceId, spaceId))
      .orderBy(
        // 조회하는 유저 본인인 경우 최상단
        currentUserId ? desc(sql`${spaceMembers.userId} = ${currentUserId}`) : sql`1`,
        desc(spaceMembers.role),
        spaceMembers.joinedAt,
      )
      .limit(limit)
      .offset(offset);
  },
  getMember: async (spaceId: string, userId: number) => {
    "use cache";
    cacheTag(CACHE_TAGS.member(spaceId, userId)); // profile 수정 시 멤버 정보 갱신 필요.
    cacheLife("weeks");
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
  getMembershipsBySpaceIds: async (spaceIds: string[], userId: number) => {
    if (spaceIds.length === 0) return [];
    return db
      .select({ spaceId: spaceMembers.spaceId })
      .from(spaceMembers)
      .where(and(inArray(spaceMembers.spaceId, spaceIds), eq(spaceMembers.userId, userId)));
  },
  getMemberCountsBySpaceIds: async (spaceIds: string[]) => {
    if (spaceIds.length === 0) return [];
    return db
      .select({
        spaceId: spaceMembers.spaceId,
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(spaceMembers)
      .where(inArray(spaceMembers.spaceId, spaceIds))
      .groupBy(spaceMembers.spaceId);
  },
};
