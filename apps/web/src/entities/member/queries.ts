import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db";
import type { NewMember } from "@/shared/db/scheme";
import { spaceMembers } from "@/shared/db/scheme";

// TODO: spaceId를 curry function 형태로 넘겨도 될 듯

export const memberQueries = {
  getBySpaceId: async (spaceId: string) => {
    return db.query.spaceMembers.findMany({
      where: eq(spaceMembers.spaceId, spaceId),
    });
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
