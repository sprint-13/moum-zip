import { inArray } from "drizzle-orm";

import { spaces } from "@/shared/db/scheme";

import type { SpaceRow } from "./model/types";

export const gatheringQueries = {
  findSpacesByMeetingIds: async (meetingIds: number[]): Promise<SpaceRow[]> => {
    if (meetingIds.length === 0 || !process.env.DATABASE_URL) {
      return [];
    }

    try {
      const { db } = await import("@/shared/db");

      return db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds));
    } catch {
      return [];
    }
  },
};
