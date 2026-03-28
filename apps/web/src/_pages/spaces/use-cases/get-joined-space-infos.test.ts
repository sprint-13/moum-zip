import type { JoinedMeetingList } from "@moum-zip/api/data-contracts";
import { describe, expect, it } from "vitest";
import type { SpaceDB } from "@/entities/spaces";
import { getJoinedSpaceInfosUseCase } from "./get-joined-space-infos";

function makeApiSpace(
  id: number,
  overrides: Partial<JoinedMeetingList["data"][number]> = {},
): JoinedMeetingList["data"][number] {
  return {
    id,
    teamId: "moum-zip-dev",
    name: `스페이스 ${id}`,
    type: "study",
    region: "건대입구",
    address: null,
    latitude: null,
    longitude: null,
    dateTime: "2026-03-26T00:00:00.000Z",
    registrationEnd: null,
    capacity: 10,
    participantCount: 0,
    image: null,
    description: null,
    canceledAt: null,
    confirmedAt: null,
    hostId: 1,
    createdBy: 1,
    createdAt: null,
    host: { id: 1, name: "호스트", image: null },
    joinedAt: null,
    isReviewed: false,
    isCompleted: false,
    updatedAt: null,
    ...overrides,
  };
}

function makeDbSpace(meetingId: number, overrides: Partial<SpaceDB> = {}): SpaceDB {
  return {
    id: `space-${meetingId}`,
    slug: `slug-${meetingId}`,
    meetingId,
    location: "online",
    themeColor: "#FF0000",
    status: "ongoing",
    modules: ["bulletin"],
    createdAt: new Date("2026-01-01"),
    ...overrides,
  };
}

function makeApiList(
  spaces: JoinedMeetingList["data"][number][],
  overrides: Partial<JoinedMeetingList> = {},
): JoinedMeetingList {
  return {
    data: spaces,
    nextCursor: null,
    hasMore: false,
    ...overrides,
  };
}

describe("getJoinedSpaceInfosUseCase", () => {
  it("API와 DB 데이터를 meetingId 기준으로 결합하여 반환한다", async () => {
    const apiList = makeApiList([makeApiSpace(1), makeApiSpace(2)]);
    const dbSpaces = [makeDbSpace(1), makeDbSpace(2)];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result).toHaveLength(2);
    expect(result[0].spaceId).toBe("space-1");
    expect(result[0].name).toBe("스페이스 1");
    expect(result[1].spaceId).toBe("space-2");
  });

  it("DB에 없는 API 스페이스는 결과에서 제외된다", async () => {
    const apiList = makeApiList([makeApiSpace(1), makeApiSpace(2)]);
    const dbSpaces = [makeDbSpace(1)]; // meetingId 2는 없음

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result).toHaveLength(1);
    expect(result[0].spaceId).toBe("space-1");
  });

  it("API 데이터가 없으면 빈 배열을 반환한다", async () => {
    const apiList = makeApiList([]);
    const dbSpaces = [makeDbSpace(1)];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result).toHaveLength(0);
  });

  it("type이 'study'이면 'study'로 매핑한다", async () => {
    const apiList = makeApiList([makeApiSpace(1, { type: "study" })]);
    const dbSpaces = [makeDbSpace(1)];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result[0].type).toBe("study");
  });

  it("type이 'study'가 아니면 'project'로 매핑한다", async () => {
    const apiList = makeApiList([makeApiSpace(1, { type: "offline" })]);
    const dbSpaces = [makeDbSpace(1)];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result[0].type).toBe("project");
  });

  it("DB의 location이 null이면 'online'으로 fallback한다", async () => {
    const apiList = makeApiList([makeApiSpace(1)]);
    const dbSpaces = [makeDbSpace(1, { location: undefined })];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result[0].location).toBe("online");
  });

  it("DB의 themeColor가 null이면 '#000000'으로 fallback한다", async () => {
    const apiList = makeApiList([makeApiSpace(1)]);
    const dbSpaces = [makeDbSpace(1, { themeColor: undefined })];

    const result = await getJoinedSpaceInfosUseCase(apiList, dbSpaces);

    expect(result[0].themeColor).toBe("#000000");
  });

  it("SpaceInfo의 모든 필드가 올바르게 매핑된다", async () => {
    const apiSpace = makeApiSpace(1, {
      name: "테스트 스페이스",
      image: "https://example.com/img.png",
      type: "study",
      dateTime: "2026-06-01T09:00:00.000Z",
      capacity: 5,
    });
    const dbSpace = makeDbSpace(1, {
      id: "db-id-1",
      location: "offline",
      themeColor: "#123456",
      status: "archived",
      modules: ["bulletin", "calendar"],
    });

    const result = await getJoinedSpaceInfosUseCase(makeApiList([apiSpace]), [dbSpace]);

    expect(result[0]).toEqual({
      spaceId: "db-id-1",
      name: "테스트 스페이스",
      image: "https://example.com/img.png",
      type: "study",
      startDate: "2026-06-01T09:00:00.000Z",
      capacity: 5,
      location: "offline",
      themeColor: "#123456",
      status: "archived",
      modules: ["bulletin", "calendar"],
    });
  });
});
