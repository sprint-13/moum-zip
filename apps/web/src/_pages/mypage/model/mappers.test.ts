import type { User, UserMeeting } from "@moum-zip/api";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatMeetingDateTime, mapJoinedMeeting, mapProfile } from "./mappers";

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
      location: "강남",
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
      imageTone: "sunset",
      actionVariant: "secondary",
      primaryBadge: {
        label: "참여 완료",
        variant: "completed",
      },
    });
  });
});
