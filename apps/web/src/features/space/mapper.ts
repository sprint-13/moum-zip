import type { JoinedMeetingList } from "@moum-zip/api";
import type { SpaceInfo } from "@/entities/spaces";

export const mapSpaceInfoList = (
  joinedMeetings: JoinedMeetingList,
  spaceStatsMap: Map<
    number,
    {
      id: string;
      slug: string;
      meetingId: number;
      location: "online" | "offline";
      themeColor: string;
      status: "ongoing" | "archived";
      modules: string[];
      memberCount: number;
      isMember: boolean;
    }
  >,
): SpaceInfo[] => {
  return joinedMeetings.data.flatMap((apiSpace) => {
    const stat = spaceStatsMap.get(apiSpace.id);
    if (!stat) return [];
    return [
      {
        spaceId: stat.id,
        slug: stat.slug,
        name: apiSpace.name,
        location: stat.location,
        themeColor: stat.themeColor,
        status: stat.status,
        modules: stat.modules,
        image: apiSpace.image,
        type: apiSpace.type === "study" ? "study" : "project",
        startDate: apiSpace.dateTime,
        capacity: stat.memberCount,
        isApproved: stat.isMember,
      },
    ];
  });
};
