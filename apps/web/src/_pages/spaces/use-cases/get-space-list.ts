import { mapSpaceInfoList } from "@/features/space/mapper";
import { spaceAndMemberJoinQueries } from "@/features/space/queries";
import { getApi, isAuth } from "@/shared/api/server";
import { AppError } from "@/shared/lib/error";
import { safe } from "@/shared/lib/safe";

export const getSpaceListUsecase = async (cursor?: string) => {
  const api = await getApi();
  const { userId } = await isAuth();

  if (userId === null) throw new AppError("UNAUTHENTICATED");

  const { data: joinedMeetings } = await safe(api.meetings.getJoined({ cursor, size: 10 }), {
    401: () => {
      throw new AppError("UNAUTHENTICATED");
    },
    default: () => {
      throw Error("Failed to fetch meetings");
    },
  });

  const meetingIds = joinedMeetings.data.map((m) => m.id);

  if (meetingIds.length === 0) {
    return {
      data: [],
      nextCursor: joinedMeetings.nextCursor,
      hasMore: joinedMeetings.hasMore,
    };
  }

  const spaceStats = await spaceAndMemberJoinQueries.getJoinedInfomation(meetingIds, userId);
  const spaceStatsMap: Map<number, (typeof spaceStats)[0]> = new Map(spaceStats.map((s) => [s.meetingId, s]));

  const data = mapSpaceInfoList(joinedMeetings, spaceStatsMap);

  return {
    data,
    nextCursor: joinedMeetings.nextCursor,
    hasMore: joinedMeetings.hasMore,
  };
};
