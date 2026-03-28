import { spaceQueries } from "@/entities/spaces/queries";
import { getApiClient } from "@/shared/api/server";
import { safe } from "@/shared/lib/safe";
import { getJoinedSpaceInfos } from "./get-joined-space-infos";

export const getSpaceList = async (cursor?: string) => {
  let authedApi: Awaited<ReturnType<typeof getApiClient>>;
  try {
    authedApi = await getApiClient(); // TODO: 인증 실패 시 401 응답
  } catch {
    throw Error("Unauthorized");
  }

  const joinedMeetings = await safe(authedApi.meetings.getJoined({ cursor, size: 10 }), {
    401: () => {
      throw Error("Unauthorized");
    },
    default: () => {
      throw Error("Failed to fetch meetings");
    },
  });

  const meetingIds = joinedMeetings.data.data.map((m) => m.id);
  const spacesFromDB = await spaceQueries.findByMeetingIds(meetingIds);

  const spaces = await getJoinedSpaceInfos(joinedMeetings.data, spacesFromDB);

  return {
    data: spaces,
    nextCursor: joinedMeetings.data.nextCursor,
    hasMore: joinedMeetings.data.hasMore,
  };
};
