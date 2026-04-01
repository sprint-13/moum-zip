import type { MeetingWithHost } from "@moum-zip/api";
import { type CreatedFilterKey, fetchMyMeetings, type MypageMoimCard, mapCreatedMeeting } from "../model";

const CREATED_MEETINGS_PAGE_SIZE = 100;

const isCompletedMeeting = (dateTime: string | null) => {
  if (!dateTime) {
    return false;
  }

  return new Date(dateTime).getTime() < Date.now();
};

const getComparableTime = (dateTime: string | null, createdFilter: CreatedFilterKey) => {
  if (!dateTime) {
    return createdFilter === "ongoing" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  }

  return new Date(dateTime).getTime();
};

export const getCreatedMeetingCards = async (createdFilter: CreatedFilterKey): Promise<MypageMoimCard[]> => {
  const response = await fetchMyMeetings({
    type: "created",
    sortBy: "dateTime",
    sortOrder: "asc",
    size: CREATED_MEETINGS_PAGE_SIZE,
  });

  const isCreatedOngoing = createdFilter === "ongoing";
  const filteredMeetings = (response.data as MeetingWithHost[])
    .filter((meeting) =>
      isCreatedOngoing ? !isCompletedMeeting(meeting.dateTime) : isCompletedMeeting(meeting.dateTime),
    )
    .sort((left, right) => {
      const leftTime = getComparableTime(left.dateTime, createdFilter);
      const rightTime = getComparableTime(right.dateTime, createdFilter);

      return isCreatedOngoing ? leftTime - rightTime : rightTime - leftTime;
    });

  return filteredMeetings.map((meeting, index) => mapCreatedMeeting(meeting, index));
};
