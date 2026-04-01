import type { api } from "@/shared/api";

interface JoinMeetingInput {
  meetingId: number;
  isJoined: boolean;
}

interface JoinMeetingDeps {
  meetingsApi: Pick<typeof api.meetings, "join" | "cancelJoin">;
}

export async function joinMeeting({ meetingId, isJoined }: JoinMeetingInput, { meetingsApi }: JoinMeetingDeps) {
  if (isJoined) {
    const response = await meetingsApi.cancelJoin(meetingId);

    return {
      meetingId,
      isJoined: false,
    };
  }

  const response = await meetingsApi.join(meetingId);

  return {
    meetingId,
    isJoined: true,
  };
}
