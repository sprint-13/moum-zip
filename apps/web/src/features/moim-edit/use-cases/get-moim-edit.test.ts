import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import { mapMeetingDetailToFormValues } from "@/features/moim-edit/model/mapper";
import type { MeetingDetailForEdit } from "@/features/moim-edit/model/types";
import type { ApiClient } from "@/shared/api";
import { getMoimEdit } from "./get-moim-edit";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/features/moim-edit/model/mapper", () => ({
  mapMeetingDetailToFormValues: vi.fn(),
}));

const mockGetDetail = vi.fn();
const mockGetSession = vi.fn();

const mockAuthedApi = {
  meetings: {
    getDetail: mockGetDetail,
  },
} as unknown as ApiClient;

const mockDeps = {
  getAuthApi: () => Promise.resolve(mockAuthedApi),
  getSession: mockGetSession,
};

describe("getMoimEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("모임 정보가 없으면 notFound를 호출한다", async () => {
    mockGetSession.mockResolvedValue({
      authenticated: true,
      userId: 1,
    });

    mockGetDetail.mockResolvedValue(null);

    await expect(
      getMoimEdit(
        {
          meetingId: 20,
        },
        mockDeps,
      ),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockGetDetail).toHaveBeenCalledWith(20);
  });

  it("작성자인 경우 initialValues를 반환한다", async () => {
    const meetingDetail: MeetingDetailForEdit = {
      hostId: 1,
      type: "스터디",
      name: "테스트 모임",
      capacity: 10,
      description: "설명입니다.",
      image: "https://example.com/image.png",
      region: "online",
      dateTime: "2026-04-10T15:00:00.000Z",
      registrationEnd: "2026-04-09T09:00:00.000Z",
      themeColor: "primary",
    };

    const mappedFormValues: MoimCreateFormValues = {
      type: "study",
      name: "테스트 모임",
      capacity: 10,
      description: "설명입니다.",
      image: "https://example.com/image.png",
      location: "online",
      date: "2026-04-11",
      time: "00:00",
      deadlineDate: "2026-04-10",
      deadlineTime: "18:00",
      themeColor: "primary",
      options: [],
    };

    mockGetSession.mockResolvedValue({
      authenticated: true,
      userId: 1,
    });

    mockGetDetail.mockResolvedValue({
      data: meetingDetail,
    });

    vi.mocked(mapMeetingDetailToFormValues).mockReturnValue(mappedFormValues);

    const result = await getMoimEdit(
      {
        meetingId: 20,
      },
      mockDeps,
    );

    expect(mockGetDetail).toHaveBeenCalledWith(20);
    expect(mapMeetingDetailToFormValues).toHaveBeenCalledWith(meetingDetail);
    expect(result).toEqual({
      initialValues: mappedFormValues,
    });
  });
});
