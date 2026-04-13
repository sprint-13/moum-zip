import { fetchMyMeetings, type MypageMoimCard, mapCreatedMeeting } from "../model";

const CREATED_MEETINGS_PAGE_SIZE = 100;

interface CreatedMeetingCards {
  ended: MypageMoimCard[];
  ongoing: MypageMoimCard[];
}

const isCompletedMeeting = (dateTime: string | null) => {
  if (!dateTime) {
    return false;
  }

  return new Date(dateTime).getTime() < Date.now();
};

const getComparableTime = (dateTime: string | null, isOngoingMeeting: boolean) => {
  if (!dateTime) {
    return isOngoingMeeting ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  }

  return new Date(dateTime).getTime();
};

const mapCreatedMeetings = (
  meetings: Awaited<ReturnType<typeof fetchMyMeetings<"created">>>["data"],
  isOngoingMeeting: boolean,
) => {
  return meetings
    .sort((left, right) => {
      const leftTime = getComparableTime(left.dateTime, isOngoingMeeting);
      const rightTime = getComparableTime(right.dateTime, isOngoingMeeting);

      return isOngoingMeeting ? leftTime - rightTime : rightTime - leftTime;
    })
    .map((meeting, index) => mapCreatedMeeting(meeting, index));
};

export const getCreatedMeetingCards = async (): Promise<CreatedMeetingCards> => {
  const response = await fetchMyMeetings({
    type: "created",
    sortBy: "dateTime",
    sortOrder: "asc",
    size: CREATED_MEETINGS_PAGE_SIZE,
  });

  const ongoingMeetings = response.data.filter((meeting) => !isCompletedMeeting(meeting.dateTime));
  const endedMeetings = response.data.filter((meeting) => isCompletedMeeting(meeting.dateTime));

  return {
    ongoing: mapCreatedMeetings(ongoingMeetings, true),
    ended: mapCreatedMeetings(endedMeetings, false),
  };
};
