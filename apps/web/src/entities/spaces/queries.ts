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
  create: async (data: NewSpaceDB) => {
    const [result] = await db.insert(spaces).values(data).returning();
    if (!result) {
      throw new Error("Space 저장 결과를 받아오지 못했습니다.");
    }
    return result;
  },
};
