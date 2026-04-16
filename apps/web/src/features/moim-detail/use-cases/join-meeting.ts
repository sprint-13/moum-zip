import type { api } from "@/shared/api";
import { ApiError, ERROR_CODES } from "@/shared/lib/error";

interface JoinMeetingInput {
  meetingId: number;
  isJoined: boolean;
}

interface JoinMeetingDeps {
  meetingsApi: Pick<typeof api.meetings, "join" | "cancelJoin">;
}

export const joinMeeting = async ({ meetingId, isJoined }: JoinMeetingInput, { meetingsApi }: JoinMeetingDeps) => {
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
  } catch (error) {
    throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
      cause: error,
      message: isJoined ? "모임 신청 취소에 실패했습니다." : "모임 신청에 실패했습니다.",
    });
  }
};
