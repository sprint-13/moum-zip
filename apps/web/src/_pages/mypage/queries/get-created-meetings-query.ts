"use client";

import type { MeetingWithHost } from "@moum-zip/api";
import { type CreatedFilterKey, fetchAllMyCreatedMeetings, mapCreatedMeeting } from "../model";

function isCompletedMeeting(dateTime: string | null) {
  if (!dateTime) {
    return false;
  }

  return new Date(dateTime).getTime() < Date.now();
}

export function getCreatedMeetingsQueryOptions(createdFilter: CreatedFilterKey) {
  const isCreatedOngoing = createdFilter === "ongoing";

  return {
    queryKey: ["mypage", "meetings", "created", createdFilter],
    queryFn: async () => {
      const response = await fetchAllMyCreatedMeetings({
        sortBy: "dateTime",
        sortOrder: "asc",
      });

      const filteredMeetings = (response.data as MeetingWithHost[])
        .filter((meeting) =>
          isCreatedOngoing ? !isCompletedMeeting(meeting.dateTime) : isCompletedMeeting(meeting.dateTime),
        )
        .sort((left, right) => {
          const leftTime = new Date(left.dateTime ?? 0).getTime();
          const rightTime = new Date(right.dateTime ?? 0).getTime();

          return isCreatedOngoing ? leftTime - rightTime : rightTime - leftTime;
        });

      return filteredMeetings.map((meeting, index) => mapCreatedMeeting(meeting, index));
    },
  } as const;
}
