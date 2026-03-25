import { eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { spaceMembers } from "@/shared/db/scheme";

export const getSpaceMembers = async (spaceId: string) => {
  return db.query.spaceMembers.findMany({
    where: eq(spaceMembers.spaceId, spaceId),
  });
};
