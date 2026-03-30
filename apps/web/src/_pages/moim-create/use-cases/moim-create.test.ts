import { beforeEach, describe, expect, it, vi } from "vitest";
import * as memberQueries from "@/entities/member";
import * as spaceQueries from "@/entities/spaces/queries";
import type { ApiClient } from "@/shared/api";
import { createMoim } from "./moim-create";

vi.mock("@/shared/api/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/api/server")>();
  return {
    ...actual,
    isAuth: vi.fn().mockResolvedValue({ authenticated: true, userId: 1 }),
  };
});

vi.mock("@/shared/db", () => ({ db: {} }));
vi.mock("@/entities/member", () => ({
  insertSpaceMember: vi.fn(),
}));
vi.mock("@/entities/spaces/queries");

const mockInsertSpace = vi.mocked(spaceQueries.insertSpace);
const mockInsertSpaceMember = vi.mocked(memberQueries.insertSpaceMember);

const mockCreate = vi.fn();
const mockGetUser = vi.fn().mockResolvedValue({
  ok: true,
  data: {
    id: 1,
    teamId: "moum-zip-dev",
    email: "test@example.com",
    name: "테스트",
    companyName: null,
    image: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
});

type AuthedApi = ApiClient;
const mockAuthedApi = {
  meetings: { create: mockCreate },
  user: { getUser: mockGetUser },
} as unknown as AuthedApi;

const mockDeps = {
  getAuthApi: () => Promise.resolve(mockAuthedApi),
};

const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const baseInput = {
  type: "study" as const,
  name: "테스트 모임",
  capacity: 10,
  description: "설명입니다.",
  image:
    "https://mblogthumb-phinf.pstatic.net/MjAyMjEwMjRfMTcw/MDAxNjY2NTQxNTAyMjE4.9uNxvgbMgHopY4EJqfCOwQiUbqEKWfbT7nE_QsdUcHgg.QliuYZbmrW_QBO0yl6fotLA7jgmjHq0486UGbvNxPpUg.JPEG.gogoa25/IMG_7088.JPG?type=w800",
  location: "online" as const,
  date: tomorrowStr,
  time: "14:00",
  deadlineDate: tomorrowStr,
  deadlineTime: "12:00",
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

describe("createMoim", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ ok: true, data: { id: 20 } });
    mockInsertSpace.mockResolvedValue(mockSpaceResult);
  });

  it("외부 API 호출 후 SPACE DB에 저장 후 멤버로 등록", async () => {
    const result = await createMoim(baseInput, mockDeps);
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockInsertSpace).toHaveBeenCalledOnce();
    expect(mockInsertSpaceMember).toHaveBeenCalledOnce();
    expect(mockInsertSpaceMember).toHaveBeenCalledWith(
      expect.objectContaining({
        spaceId: mockSpaceResult.id,
        userId: 1,
        role: "manager",
        nickname: "테스트",
        email: "test@example.com",
        avatarUrl: null,
      }),
    );
    expect(result.meeting.id).toBe(20);
    expect(result.space.slug).toBe("20");
  });

  it("외부 API 실패 시 에러를 던짐", async () => {
    mockCreate.mockResolvedValue({ ok: false });
    await expect(createMoim(baseInput, mockDeps)).rejects.toThrow("모임 생성에 실패했습니다.");
  });

  it("외부 API 실패 시 SPACE DB insert를 호출하지 않는다", async () => {
    mockCreate.mockResolvedValue({ ok: false });
    await expect(createMoim(baseInput, mockDeps)).rejects.toThrow();
    expect(mockInsertSpace).not.toHaveBeenCalled();
    expect(mockInsertSpaceMember).not.toHaveBeenCalled();
  });

  it("스페이스 멤버 등록 실패 시 에러를 던짐", async () => {
    mockInsertSpaceMember.mockRejectedValue(new Error("스페이스 멤버 저장에 실패했습니다."));
    await expect(createMoim(baseInput, mockDeps)).rejects.toThrow("스페이스 멤버 저장에 실패했습니다.");
  });
});
