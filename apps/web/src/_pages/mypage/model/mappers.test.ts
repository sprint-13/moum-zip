import type { FavoriteWithMeeting, JoinedMeeting, MeetingWithHost, User } from "@moum-zip/api";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatMeetingDateTime, mapCreatedMeeting, mapFavoriteMeeting, mapJoinedMeeting, mapProfile } from "./mappers";

describe("mypage mappers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("내 정보 응답을 마이페이지 프로필 형태로 변환한다", () => {
    const user: User = {
      id: 1,
      teamId: "dallaem",
      email: "test@example.com",
      name: "홍길동",
      companyName: "코드잇",
      image: "https://example.com/profile.png",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    expect(mapProfile(user)).toEqual({
      userId: 1,
      name: "홍길동",
      email: "test@example.com",
      imageUrl: "https://example.com/profile.png",
    });
  });

  it("모임 날짜를 한국 시간 기준 날짜와 시간으로 변환한다", () => {
    expect(formatMeetingDateTime("2026-02-10T14:00:00.000Z")).toMatchObject({
      date: "2월 10일",
      time: "23:00",
    });
  });

  it("개설 확정 전 참여 모임은 승인 대기 중 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const meeting: JoinedMeeting = {
      id: 7,
      teamId: "dallaem",
      name: "달램핏 모임",
      type: "스터디",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "강남",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: null,
      participantCount: 5,
      capacity: 10,
      image: "https://example.com/meeting.png",
      description: null,
      canceledAt: null,
      confirmedAt: null,
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
      joinedAt: "2026-02-01T00:00:00.000Z",
      isReviewed: false,
      isCompleted: false,
    };

    expect(mapJoinedMeeting(meeting, 1, 3)).toMatchObject({
      id: "7",
      title: "달램핏 모임",
      participantCount: "5/10",
      location: "강남",
      imageUrl: "https://example.com/meeting.png",
      imageTone: "daylight",
      actionVariant: "secondary",
      primaryBadge: {
        label: "승인 대기 중",
        variant: "waiting",
      },
    });
    expect(mapJoinedMeeting(meeting, 1, 3).secondaryBadge).toBeUndefined();
  });

  it("개설 확정된 참여 모임은 참여 중 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-05T00:00:00.000Z"));

    const meeting: JoinedMeeting = {
      id: 17,
      teamId: "dallaem",
      name: "개설 확정된 참여 모임",
      type: "스터디",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "강남",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: "2026-02-03T14:00:00.000Z",
      participantCount: 5,
      capacity: 10,
      image: null,
      description: null,
      canceledAt: null,
      confirmedAt: "2026-02-03T15:00:00.000Z",
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
      joinedAt: "2026-02-01T00:00:00.000Z",
      isReviewed: false,
      isCompleted: false,
    };

    expect(mapJoinedMeeting(meeting, 1, 3)).toMatchObject({
      actionVariant: "primary",
      primaryBadge: {
        label: "참여 중",
        variant: "scheduled",
      },
      secondaryBadge: {
        label: "개설확정",
        variant: "confirmed",
        withIcon: true,
      },
    });
  });

  it("개설 확정 전 지난 참여 모임도 승인 대기 중 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T00:00:00.000Z"));

    const meeting: JoinedMeeting = {
      id: 8,
      teamId: "dallaem",
      name: "지난 모임",
      type: "스터디",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "성수",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: null,
      participantCount: 8,
      capacity: 12,
      image: null,
      description: null,
      canceledAt: null,
      confirmedAt: null,
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
      joinedAt: "2026-02-01T00:00:00.000Z",
      isReviewed: false,
      isCompleted: true,
    };

    expect(mapJoinedMeeting(meeting, 2, 3)).toMatchObject({
      id: "8",
      location: "성수",
      imageTone: "sunset",
      actionVariant: "secondary",
      primaryBadge: {
        label: "승인 대기 중",
        variant: "waiting",
      },
    });
    expect(mapJoinedMeeting(meeting, 2, 3).secondaryBadge).toBeUndefined();
  });

  it("개설 확정된 지난 참여 모임도 참여 중 상태와 개설확정 배지를 유지한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T00:00:00.000Z"));

    const meeting: JoinedMeeting = {
      id: 18,
      teamId: "dallaem",
      name: "개설 확정 지난 모임",
      type: "스터디",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "성수",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: "2026-02-03T14:00:00.000Z",
      participantCount: 8,
      capacity: 12,
      image: null,
      description: null,
      canceledAt: null,
      confirmedAt: "2026-02-03T15:00:00.000Z",
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
      joinedAt: "2026-02-01T00:00:00.000Z",
      isReviewed: false,
      isCompleted: true,
    };

    expect(mapJoinedMeeting(meeting, 2, 3)).toMatchObject({
      actionVariant: "primary",
      primaryBadge: {
        label: "참여 중",
        variant: "scheduled",
      },
      secondaryBadge: {
        label: "개설확정",
        variant: "confirmed",
        withIcon: true,
      },
    });
  });

  it("호스트인 참여 모임은 개설 확정 전에도 참여 중으로 표시한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const meeting: JoinedMeeting = {
      id: 27,
      teamId: "dallaem",
      name: "내가 만든 모임이 joined에 보이는 경우",
      type: "스터디",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "강남",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: null,
      participantCount: 1,
      capacity: 10,
      image: null,
      description: null,
      canceledAt: null,
      confirmedAt: null,
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
      joinedAt: "2026-02-01T00:00:00.000Z",
      isReviewed: false,
      isCompleted: false,
    };

    expect(mapJoinedMeeting(meeting, 1, 1)).toMatchObject({
      actionVariant: "secondary",
      primaryBadge: {
        label: "참여 중",
        variant: "waiting",
      },
    });
  });

  it("내가 만든 모임은 진행 상태에 맞는 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const meeting: MeetingWithHost = {
      id: 11,
      teamId: "dallaem",
      name: "내가 만든 모임",
      type: "프로젝트",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "을지로",
      address: null,
      latitude: null,
      longitude: null,
      registrationEnd: null,
      participantCount: 12,
      capacity: 20,
      image: "https://example.com/created.png",
      description: null,
      canceledAt: null,
      confirmedAt: null,
      hostId: 1,
      createdBy: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      host: {
        id: 1,
        name: "호스트",
        image: null,
      },
    };

    expect(mapCreatedMeeting(meeting, 0)).toMatchObject({
      id: "11",
      location: "을지로",
      imageUrl: "https://example.com/created.png",
      imageTone: "beige",
      actionVariant: "primary",
      primaryBadge: {
        label: "진행 중",
        variant: "scheduled",
      },
      secondaryBadge: {
        label: "개설대기",
        variant: "waiting",
        withIcon: false,
      },
    });
  });

  it("찜한 모임 응답을 찜 카드 형태로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const favorite: FavoriteWithMeeting = {
      id: 1,
      teamId: "dallaem",
      meetingId: 12,
      userId: 3,
      createdAt: "2026-02-01T00:00:00.000Z",
      meeting: {
        id: 12,
        teamId: "dallaem",
        name: "찜한 모임",
        type: "달램핏",
        region: "성수",
        address: null,
        latitude: null,
        longitude: null,
        dateTime: "2026-02-10T14:00:00.000Z",
        registrationEnd: "2026-02-09T14:00:00.000Z",
        capacity: 10,
        participantCount: 5,
        image: null,
        description: null,
        canceledAt: null,
        confirmedAt: "2026-02-01T10:00:00.000Z",
        hostId: 1,
        createdBy: 1,
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        host: {
          id: 1,
          name: "호스트",
          image: null,
        },
      },
    };

    expect(mapFavoriteMeeting(favorite, 3, 3)).toMatchObject({
      id: "12",
      liked: true,
      location: "성수",
      imageTone: "city",
      actionVariant: "primary",
      primaryBadge: {
        label: "참여 중",
        variant: "scheduled",
      },
      secondaryBadge: {
        label: "개설확정",
        variant: "confirmed",
        withIcon: true,
      },
    });
  });

  it("호스트가 찜한 자신의 모임은 개설 확정 전에도 참여 중으로 표시한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const favorite: FavoriteWithMeeting = {
      id: 2,
      teamId: "dallaem",
      meetingId: 19,
      userId: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      meeting: {
        id: 19,
        teamId: "dallaem",
        name: "내가 만든 찜 모임",
        type: "달램핏",
        region: "성수",
        address: null,
        latitude: null,
        longitude: null,
        dateTime: "2026-02-10T14:00:00.000Z",
        registrationEnd: "2026-02-09T14:00:00.000Z",
        capacity: 10,
        participantCount: 1,
        image: null,
        description: null,
        canceledAt: null,
        confirmedAt: null,
        hostId: 1,
        createdBy: 1,
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        host: {
          id: 1,
          name: "호스트",
          image: null,
        },
      },
    };

    expect(mapFavoriteMeeting(favorite, 0, 1)).toMatchObject({
      actionVariant: "secondary",
      primaryBadge: {
        label: "참여 중",
        variant: "waiting",
      },
    });
  });
});
