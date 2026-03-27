import { describe, expect, it, vi } from "vitest";
import { deleteMeeting } from "./delete-meeting";

describe("deleteMeeting", () => {
  it("meetingId로 모임 삭제를 요청한다", async () => {
    const mockMeetingsApi = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const result = await deleteMeeting({ meetingId: 1 }, { meetingsApi: mockMeetingsApi });

    expect(mockMeetingsApi.delete).toHaveBeenCalledOnce();
    expect(mockMeetingsApi.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      meetingId: 1,
    });
  });
});
