import type { api } from "@/shared/api";

interface JoinMeetingInput {
  meetingId: number;
  isJoined: boolean;
}

interface JoinMeetingDeps {
  meetingsApi: Pick<typeof api.meetings, "join" | "cancelJoin">;
}

export async function joinMeeting({ meetingId, isJoined }: JoinMeetingInput, { meetingsApi }: JoinMeetingDeps) {
  try {
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
  } catch {
    throw new Error(isJoined ? "모임 신청 취소에 실패했습니다." : "모임 신청에 실패했습니다.");
  }
}
