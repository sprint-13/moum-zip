import { spaceQueries } from "@/entities/spaces/queries";
import { getAuthenticatedApi } from "@/shared/api/auth-client";
import { safe } from "@/shared/lib/safe";
import { getJoinedSpaceInfosUseCase } from "./get-joined-space-infos";

export const getSpaceListRemote = async (cursor?: string) => {
  let authedApi: Awaited<ReturnType<typeof getAuthenticatedApi>>;
  try {
    authedApi = await getAuthenticatedApi(); // TODO: 인증 실패 시 401 응답
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

  if (meetingIds.length === 0) {
    return {
      data: [],
      nextCursor: joinedMeetings.data.nextCursor,
      hasMore: joinedMeetings.data.hasMore,
    };
  }

  const spacesFromDB = await spaceQueries.findByMeetingIds(meetingIds);

  const spaces = await getJoinedSpaceInfosUseCase(joinedMeetings.data, spacesFromDB);

  return {
    data: spaces,
    nextCursor: joinedMeetings.data.nextCursor,
    hasMore: joinedMeetings.data.hasMore,
  };
};
