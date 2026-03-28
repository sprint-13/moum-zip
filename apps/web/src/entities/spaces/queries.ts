import { eq, inArray } from "drizzle-orm";
import { db } from "@/shared/db";
import { type NewSpaceDB, spaces } from "@/shared/db/scheme";

// meetingId -> space 조회 -> location, themeColor, status, modules

export const spaceQueries = {
  /** meetingId로 space 조회 */
  findByMeetingId: (meetingId: number) =>
    db.query.spaces.findFirst({
      where: eq(spaces.meetingId, meetingId),
    }),
  findByMeetingIds: (meetingIds: number[]) => db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds)),
};

// 모임 생성 시 SPACE 테이블에 저장 (MEETING 생성 후 meetingId 연결)
export async function insertSpace(data: NewSpaceDB) {
  const [result] = await db.insert(spaces).values(data).returning();
  if (!result) {
    throw new Error("Space 저장 결과를 받아오지 못했습니다.");
  }
  return result;
}

// 모임 생성 후 redirect된 /space/[slug] 페이지에서 데이터 조회 시 사용
export async function selectSpaceBySlug(slug: string) {
  const [result] = await db.select().from(spaces).where(eq(spaces.slug, slug));
  return result ?? null;
}
