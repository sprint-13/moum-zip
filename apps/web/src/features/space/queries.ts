import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/shared/db";
import { spaceMembers, spaces } from "@/shared/db/scheme";

export const spaceAndMemberJoinQueries = {
  /** spaces + spaceMembers JOIN with aggregation: memberCount, isMember */
  getJoinedInformation: async (meetingIds: number[], userId: number) => {
    return db
      .select({
        id: spaces.id,
        slug: spaces.slug,
        meetingId: spaces.meetingId,
        location: spaces.location,
        themeColor: spaces.themeColor,
        status: spaces.status,
        modules: spaces.modules,
        memberCount: sql<number>`COUNT(${spaceMembers.id})`.mapWith(Number),
        isMember: sql<boolean>`COALESCE(BOOL_OR(${spaceMembers.userId} = ${userId}), false)`,
      })
      .from(spaces)
      .leftJoin(spaceMembers, eq(spaces.id, spaceMembers.spaceId))
      .where(inArray(spaces.meetingId, meetingIds))
      .groupBy(
        spaces.id,
        spaces.slug,
        spaces.meetingId,
        spaces.location,
        spaces.themeColor,
        spaces.status,
        spaces.modules,
      );
  },
};
