import { eq, inArray } from "drizzle-orm";
import { db } from "@/shared/db";
import { spaces } from "@/shared/db/scheme";

// meetingId -> space 조회 -> location, themeColor, status, modules

export const spaceQueries = {
  /** meetingId로 space 조회 */
  findByMeetingId: (meetingId: number) =>
    db.query.spaces.findFirst({
      where: eq(spaces.meetingId, meetingId),
    }),
  findByMeetingIds: (meetingIds: number[]) => db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds)),
};
