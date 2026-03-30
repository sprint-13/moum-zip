import type { api } from "@/shared/api";

interface DeleteMeetingInput {
  meetingId: number;
}

interface DeleteMeetingDeps {
  meetingsApi: Pick<typeof api.meetings, "delete">;
}

export async function deleteMeeting({ meetingId }: DeleteMeetingInput, { meetingsApi }: DeleteMeetingDeps) {
  await meetingsApi.delete(meetingId);

  return {
    meetingId,
  };
}
