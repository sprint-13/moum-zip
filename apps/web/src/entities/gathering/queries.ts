import { inArray } from "drizzle-orm";

import { spaces } from "@/shared/db/scheme";

import type { SpaceRow } from "./model/types";

export const gatheringQueries = {
  findSpacesByMeetingIds: async (meetingIds: number[]): Promise<SpaceRow[]> => {
    if (meetingIds.length === 0) {
      return [];
    }

    if (!process.env.DATABASE_URL) {
      console.log("[search] space lookup skipped: missing DATABASE_URL"); //로그
      return [];
    }

    try {
      const { db } = await import("@/shared/db"); //db조회
      const foundSpaces = await db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds)); //db조회 로그

      console.log("[search] space lookup success", {
        foundSpaces: foundSpaces.length,
        requestedMeetingIds: meetingIds,
      });

      return foundSpaces;
    } catch (error) {
      console.log("[search] space lookup failed", error);
      return [];
    }
  },
};
