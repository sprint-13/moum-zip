import { eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/shared/db";
import { type NewSpaceDB, spaces } from "@/shared/db/scheme";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { ApiError, ERROR_CODES } from "@/shared/lib/error";

// meetingId -> space 조회 -> location, themeColor, status, modules
export const spaceQueries = {
  findBySlug: async (slug: string) => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.space(slug));
    const space = await db.query.spaces.findFirst({
      where: eq(spaces.slug, slug),
    });
    return space;
  },
  /** meetingId로 space 조회 */
  findByMeetingId: (meetingId: number) =>
    db.query.spaces.findFirst({
      where: eq(spaces.meetingId, meetingId),
    }),
  findByMeetingIds: (meetingIds: number[]) => db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds)),
  create: async (data: NewSpaceDB) => {
    const [result] = await db.insert(spaces).values(data).returning();
    if (!result) {
      throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
        message: "Space 저장 결과를 받아오지 못했습니다.",
      });
    }
    return result;
  },
  updateByMeetingId: async (meetingId: number, data: Partial<NewSpaceDB>) => {
    const [result] = await db.update(spaces).set(data).where(eq(spaces.meetingId, meetingId)).returning();

    if (!result) {
      throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
        message: "Space 저장 결과를 받아오지 못했습니다.",
      });
    }

    return result;
  },
};
