import { inArray } from "drizzle-orm";

import { db } from "@/shared/db";
import { spaces } from "@/shared/db/scheme";

import type { SpaceRow } from "./model/types";

export const gatheringQueries = {
  findSpacesByMeetingIds: async (meetingIds: number[]): Promise<SpaceRow[]> => {
    if (meetingIds.length === 0) {
      return [];
    }

    return db.select().from(spaces).where(inArray(spaces.meetingId, meetingIds));
  },
};
