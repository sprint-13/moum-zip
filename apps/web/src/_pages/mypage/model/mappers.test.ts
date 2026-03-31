import type { FavoriteWithMeeting, User, UserMeeting } from "@moum-zip/api";
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

  it("다가오는 참여 모임은 참여 예정 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const meeting: UserMeeting = {
      id: 7,
      name: "달램핏 모임",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "강남",
      participantCount: 5,
      capacity: 10,
      role: "participant",
    };

    expect(mapJoinedMeeting(meeting, 1)).toMatchObject({
      id: "7",
      title: "달램핏 모임",
      participantCount: "5/10",
      location: "offline",
      imageTone: "daylight",
      actionVariant: "primary",
      primaryBadge: {
        label: "참여 예정",
        variant: "scheduled",
      },
    });
  });

  it("지난 참여 모임은 참여 완료 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T00:00:00.000Z"));

    const meeting: UserMeeting = {
      id: 8,
      name: "지난 모임",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "성수",
      participantCount: 8,
      capacity: 12,
      role: "participant",
      isReviewed: false,
    };

    expect(mapJoinedMeeting(meeting, 2)).toMatchObject({
      id: "8",
      location: "offline",
      imageTone: "sunset",
      actionVariant: "secondary",
      primaryBadge: {
        label: "참여 완료",
        variant: "completed",
      },
    });
  });

  it("내가 만든 모임은 진행 상태에 맞는 카드로 변환한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00.000Z"));

    const meeting: UserMeeting = {
      id: 11,
      name: "내가 만든 모임",
      dateTime: "2026-02-10T14:00:00.000Z",
      region: "을지로",
      participantCount: 12,
      capacity: 20,
      role: "host",
    };

    expect(mapCreatedMeeting(meeting, 0)).toMatchObject({
      id: "11",
      location: "offline",
      imageTone: "beige",
      actionVariant: "primary",
      primaryBadge: {
        label: "진행 중",
        variant: "scheduled",
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

    expect(mapFavoriteMeeting(favorite, 3)).toMatchObject({
      id: "12",
      liked: true,
      location: "offline",
      imageTone: "city",
      secondaryBadge: {
        label: "개설확정",
        variant: "confirmed",
        withIcon: true,
      },
    });
  });
});
