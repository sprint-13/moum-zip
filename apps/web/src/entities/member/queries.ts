import { eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { type NewMember, spaceMembers } from "@/shared/db/scheme";

export const getSpaceMembers = async (spaceId: string) => {
  return db.query.spaceMembers.findMany({
    where: eq(spaceMembers.spaceId, spaceId),
  });
};

export async function insertSpaceMember(data: NewMember) {
  const [row] = await db.insert(spaceMembers).values(data).returning();
  if (!row) throw new Error("스페이스 멤버 저장에 실패했습니다.");
  return row;
}
