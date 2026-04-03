import type { JoinedMeetingList } from "@moum-zip/api";
import { memberQueries } from "@/entities/member/queries";
import type { SpaceDB, SpaceInfo } from "@/entities/spaces";

export const getJoinedSpaceInfosUseCase = async (
  spacesFromApi: JoinedMeetingList,
  spacesFromDB: SpaceDB[],
  userId: number,
): Promise<SpaceInfo[]> => {
  const dbSpaceMap = new Map(spacesFromDB.map((dbSpace) => [dbSpace.meetingId, dbSpace]));
  const spaceIds = spacesFromDB.map((s) => s.id);

  const [memberships, memberCounts] = await Promise.all([
    memberQueries.getMembershipsBySpaceIds(spaceIds, userId),
    memberQueries.getMemberCountsBySpaceIds(spaceIds),
  ]);

  const approvedSpaceIds = new Set(memberships.map((m) => m.spaceId));
  const memberCountMap = new Map(memberCounts.map((c) => [c.spaceId, c.count]));

  return spacesFromApi.data.flatMap((apiSpace) => {
    const dbSpace = dbSpaceMap.get(apiSpace.id);
    if (!dbSpace) return [];
    return {
      spaceId: dbSpace.id,
      slug: dbSpace.slug,
      name: apiSpace.name,
      location: dbSpace.location ?? "online",
      themeColor: dbSpace.themeColor ?? "#000000",
      status: dbSpace.status,
      modules: dbSpace.modules,
      image: apiSpace.image,
      type: apiSpace.type === "study" ? "study" : "project",
      startDate: apiSpace.dateTime,
      capacity: memberCountMap.get(dbSpace.id) ?? 0,
      isApproved: approvedSpaceIds.has(dbSpace.id),
    };
  });
};
