import { spaceQueries } from "@/entities/spaces/queries";
import { getApi, isAuth } from "@/shared/api/server";
import { safe } from "@/shared/lib/safe";
import { getJoinedSpaceInfosUseCase } from "./get-joined-space-infos";

export const getSpaceListRemote = async (cursor?: string) => {
  const [api, { userId }] = await Promise.all([getApi(), isAuth()]);

  const joinedMeetings = await safe(api.meetings.getJoined({ cursor, size: 10 }), {
    401: () => {
      throw Error("Unauthorized");
    },
    default: () => {
      throw Error("Failed to fetch meetings");
    },
  });

  const meetingIds = joinedMeetings.data.data.map((m) => m.id);

  if (meetingIds.length === 0) {
    return {
      data: [],
      nextCursor: joinedMeetings.data.nextCursor,
      hasMore: joinedMeetings.data.hasMore,
    };
  }

  const spacesFromDB = await spaceQueries.findByMeetingIds(meetingIds);

  const spaces = await getJoinedSpaceInfosUseCase(joinedMeetings.data, spacesFromDB, userId ?? 0);

  return {
    data: spaces,
    nextCursor: joinedMeetings.data.nextCursor,
    hasMore: joinedMeetings.data.hasMore,
  };
};
