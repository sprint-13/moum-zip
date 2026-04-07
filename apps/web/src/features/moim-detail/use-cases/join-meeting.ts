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
    await meetingsApi.cancelJoin(meetingId);

    return {
      meetingId,
      isJoined: false,
    };
  }

  await meetingsApi.join(meetingId);

  return {
    meetingId,
    isJoined: true,
  };
}
