import { describe, expect, it, vi } from "vitest";
import { joinMeeting } from "./join-meeting";

describe("joinMeeting", () => {
  it("이미 참여한 모임이면 참여를 취소한다", async () => {
    const mockMeetingsApi = {
      join: vi.fn(),
      cancelJoin: vi.fn().mockResolvedValue(undefined),
    };

    const result = await joinMeeting({ meetingId: 1, isJoined: true }, { meetingsApi: mockMeetingsApi });

    expect(mockMeetingsApi.cancelJoin).toHaveBeenCalledOnce();
    expect(mockMeetingsApi.cancelJoin).toHaveBeenCalledWith(1);
    expect(mockMeetingsApi.join).not.toHaveBeenCalled();
    expect(result).toEqual({
      meetingId: 1,
      isJoined: false,
    });
  });

  it("참여하지 않은 모임이면 참여를 요청한다", async () => {
    const mockMeetingsApi = {
      join: vi.fn().mockResolvedValue(undefined),
      cancelJoin: vi.fn(),
    };

    const result = await joinMeeting({ meetingId: 1, isJoined: false }, { meetingsApi: mockMeetingsApi });

    expect(mockMeetingsApi.join).toHaveBeenCalledOnce();
    expect(mockMeetingsApi.join).toHaveBeenCalledWith(1);
    expect(mockMeetingsApi.cancelJoin).not.toHaveBeenCalled();
    expect(result).toEqual({
      meetingId: 1,
      isJoined: true,
    });
  });
});
