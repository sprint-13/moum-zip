"use client";

import { fetchMyMeetings, type MypageMoimCard, mapJoinedMeeting } from "../model";

export const getJoinedMeetingsQueryOptions = (initialData: MypageMoimCard[]) => {
  return {
    queryKey: ["mypage", "meetings", "joined"],
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "joined",
        sortBy: "dateTime",
        sortOrder: "asc",
        size: 10,
      });

      return response.data.map((meeting, index) => mapJoinedMeeting(meeting, index));
    },
    initialData,
  } as const;
};
