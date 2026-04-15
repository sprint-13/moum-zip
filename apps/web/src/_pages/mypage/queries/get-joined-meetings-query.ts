"use client";

import { fetchMyMeetings, type MypageMoimCard, mapJoinedMeeting } from "../model";

export const getJoinedMeetingsQueryKey = (currentUserId: number) => {
  return ["mypage", "meetings", "joined", currentUserId] as const;
};

export const getJoinedMeetingsQueryOptions = (initialData: MypageMoimCard[], currentUserId: number) => {
  return {
    queryKey: getJoinedMeetingsQueryKey(currentUserId),
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "joined",
        sortBy: "dateTime",
        sortOrder: "asc",
        size: 10,
      });

      return response.data.map((meeting, index) => mapJoinedMeeting(meeting, index, currentUserId));
    },
    initialData,
  } as const;
};
