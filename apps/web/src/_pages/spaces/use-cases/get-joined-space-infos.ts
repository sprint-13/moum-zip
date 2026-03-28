import type { JoinedMeetingList } from "@moum-zip/api";
import type { SpaceDB, SpaceInfo } from "@/entities/spaces";

export const getJoinedSpaceInfos = async (
  spacesFromApi: JoinedMeetingList,
  spacesFromDB: SpaceDB[],
): Promise<SpaceInfo[]> => {
  const dbSpaceMap = new Map(spacesFromDB.map((dbSpace) => [dbSpace.meetingId, dbSpace]));

  // 5. API 데이터와 DB 데이터를 결합 (Hydration)
  return spacesFromApi.data.flatMap((apiSpace) => {
    const dbSpace = dbSpaceMap.get(apiSpace.id);
    if (!dbSpace) return [];
    return {
      spaceId: dbSpace.id, // 또는 적절한 Fallback
      name: apiSpace.name,
      location: dbSpace.location || "online",
      themeColor: dbSpace.themeColor || "#000000",
      status: dbSpace.status || "ongoing",
      modules: dbSpace.modules || [],
      image: apiSpace.image,
      type: apiSpace.type === "study" ? "study" : "project",
      startDate: apiSpace.dateTime,
      capacity: apiSpace.capacity,
    };
  });
};
