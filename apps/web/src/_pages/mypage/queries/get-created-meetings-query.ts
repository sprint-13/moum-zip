"use client";

import { type CreatedFilterKey, fetchMyMeetings, mapCreatedMeeting } from "../model";

export function getCreatedMeetingsQueryOptions(createdFilter: CreatedFilterKey) {
  const isCreatedOngoing = createdFilter === "ongoing";

  return {
    queryKey: ["mypage", "meetings", "created", createdFilter],
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "created",
        completed: isCreatedOngoing ? "false" : "true",
        sortBy: "dateTime",
        sortOrder: isCreatedOngoing ? "asc" : "desc",
        size: 10,
      });

      return response.data.map((meeting, index) => mapCreatedMeeting(meeting, index));
    },
  } as const;
}
