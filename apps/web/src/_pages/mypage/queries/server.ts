import { getApi } from "@/shared/api/server";

export interface MyMeetingsServerQuery {
  type: "joined" | "created";
  completed?: "true" | "false";
  reviewed?: "true" | "false";
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
}

export const getMyMeetings = async (query: MyMeetingsServerQuery) => {
  const api = await getApi();

  if (query.type === "joined") {
    return api.meetings.getJoined({
      completed: query.completed,
      reviewed: query.reviewed,
      sortBy:
        query.sortBy === "dateTime" || query.sortBy === "registrationEnd" || query.sortBy === "joinedAt"
          ? query.sortBy
          : undefined,
      sortOrder: query.sortOrder,
      size: query.size,
      cursor: query.cursor,
    });
  }

  return api.meetings.getCreated({
    sortBy:
      query.sortBy === "dateTime" || query.sortBy === "registrationEnd" || query.sortBy === "participantCount"
        ? query.sortBy
        : undefined,
    sortOrder: query.sortOrder,
    size: query.size,
    cursor: query.cursor,
  });
};

export const getMyJoinedMeetings = async () => {
  const api = await getApi();

  return api.meetings.getJoined({
    sortBy: "dateTime",
    sortOrder: "asc",
    size: 10,
  });
};
