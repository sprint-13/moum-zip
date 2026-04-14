import { beforeEach, describe, expect, it, vi } from "vitest";
import { spaceQueries } from "@/entities/spaces";
import type { ApiClient } from "@/shared/api";
import { updateMoim } from "./moim-update";

const { mockIsAuth, mockGetDetail, mockUpdate } = vi.hoisted(() => ({
  mockIsAuth: vi.fn(),
  mockGetDetail: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("@/shared/api/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/api/server")>();

  return {
    ...actual,
    isAuth: mockIsAuth,
  };
});

vi.mock("@/shared/db", () => ({ db: {} }));
vi.mock("@/entities/spaces");

const mockUpdateSpace = vi.mocked(spaceQueries.updateByMeetingId);

type AuthedApi = ApiClient;

const mockAuthedApi = {
  meetings: {
    getDetail: mockGetDetail,
    update: mockUpdate,
  },
} as unknown as AuthedApi;

const mockDeps = {
  getAuthApi: () => Promise.resolve(mockAuthedApi),
  getSession: mockIsAuth,
};

const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const baseInput = {
  type: "study" as const,
  name: "테스트 모임",
  capacity: 10,
  description: "설명입니다.",
  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
  location: "online" as const,
  date: tomorrowStr,
  time: "15:00",
  deadlineDate: tomorrowStr,
  deadlineTime: "09:00",
  themeColor: "primary",
  options: [],
};

const mockSpaceResult = {
  id: "20",
  slug: "20",
  meetingId: 20,
  location: "online" as const,
  themeColor: "primary",
  status: "ongoing" as const,
  modules: [],
  createdAt: new Date(),
};

describe("updateMoim", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockIsAuth.mockResolvedValue({
      authenticated: true,
      userId: 1,
    });

    mockGetDetail.mockResolvedValue({
      data: {
        hostId: 1,
      },
    });

    mockUpdate.mockResolvedValue({
      ok: true,
      data: { id: 20 },
    });

    mockUpdateSpace.mockResolvedValue(mockSpaceResult);
  });

  it("외부 API 호출 후 SPACE DB를 수정한다", async () => {
    const result = await updateMoim(
      {
        meetingId: 20,
        data: baseInput,
      },
      mockDeps,
    );

    expect(mockGetDetail).toHaveBeenCalledOnce();
    expect(mockGetDetail).toHaveBeenCalledWith(20);

    expect(mockUpdate).toHaveBeenCalledOnce();
    expect(mockUpdateSpace).toHaveBeenCalledOnce();

    expect(mockUpdate).toHaveBeenCalledWith(20, {
      name: "테스트 모임",
      type: "스터디",
      capacity: 10,
      description: "설명입니다.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
      region: "online",
      dateTime: new Date(`${tomorrowStr}T15:00`).toISOString(),
      registrationEnd: new Date(`${tomorrowStr}T09:00`).toISOString(),
    });

    expect(mockUpdateSpace).toHaveBeenCalledWith(20, {
      location: "online",
      themeColor: "primary",
      modules: [],
    });

    expect(result).toEqual({
      meeting: { id: 20 },
    });
  });

  it("project 타입은 프로젝트로 변환한다", async () => {
    const input = {
      ...baseInput,
      type: "project" as const,
      location: "offline" as const,
    };

    await updateMoim(
      {
        meetingId: 5,
        data: input,
      },
      mockDeps,
    );

    expect(mockGetDetail).toHaveBeenCalledWith(5);

    expect(mockUpdate).toHaveBeenCalledWith(
      5,
      expect.objectContaining({
        type: "프로젝트",
        region: "offline",
      }),
    );

    expect(mockUpdateSpace).toHaveBeenCalledWith(5, {
      location: "offline",
      themeColor: "primary",
      modules: [],
    });
  });

  it("외부 API 실패 시 에러를 던짐", async () => {
    mockUpdate.mockResolvedValue({ ok: false });

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("모임 수정에 실패했습니다.");
  });

  it("외부 API 실패 시 SPACE DB update를 호출하지 않는다", async () => {
    mockUpdate.mockResolvedValue({ ok: false });

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("모임 수정에 실패했습니다.");

    expect(mockUpdateSpace).not.toHaveBeenCalled();
  });

  it("로그인하지 않은 경우 에러를 던짐", async () => {
    mockIsAuth.mockResolvedValueOnce({
      authenticated: false,
      userId: null,
    });

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("로그인이 필요합니다.");

    expect(mockGetDetail).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockUpdateSpace).not.toHaveBeenCalled();
  });

  it("작성자가 아닌 경우 에러를 던짐", async () => {
    mockGetDetail.mockResolvedValue({
      data: {
        hostId: 999,
      },
    });

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("수정 권한이 없습니다.");

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockUpdateSpace).not.toHaveBeenCalled();
  });

  it("모임 정보가 없으면 수정 권한 에러를 던짐", async () => {
    mockGetDetail.mockResolvedValue(null);

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("수정 권한이 없습니다.");

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockUpdateSpace).not.toHaveBeenCalled();
  });

  it("모임 상세 조회 실패 시 에러를 던짐", async () => {
    mockGetDetail.mockRejectedValue(new Error("조회 실패"));

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("모임 정보를 불러오지 못했습니다.");

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockUpdateSpace).not.toHaveBeenCalled();
  });

  it("SPACE DB 수정 실패 시 에러를 던짐", async () => {
    mockUpdateSpace.mockRejectedValue(new Error("Space 저장 결과를 받아오지 못했습니다."));

    await expect(
      updateMoim(
        {
          meetingId: 20,
          data: baseInput,
        },
        mockDeps,
      ),
    ).rejects.toThrow("Space 저장 결과를 받아오지 못했습니다.");
  });
});
