import { describe, expect, it, vi } from "vitest";
import { favoriteMeeting } from "./favorite-meeting";

describe("favoriteMeeting", () => {
  it("이미 찜한 모임이면 찜하기를 취소한다", async () => {
    const mockFavoritesApi = {
      create: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const result = await favoriteMeeting({ meetingId: 1, isLiked: true }, { favoritesApi: mockFavoritesApi });

    expect(mockFavoritesApi.delete).toHaveBeenCalledOnce();
    expect(mockFavoritesApi.delete).toHaveBeenCalledWith(1);
    expect(mockFavoritesApi.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      meetingId: 1,
      isLiked: false,
    });
  });

  it("찜하지 않은 모임이면 찜하기를 요청한다", async () => {
    const mockFavoritesApi = {
      create: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
    };

    const result = await favoriteMeeting({ meetingId: 1, isLiked: false }, { favoritesApi: mockFavoritesApi });

    expect(mockFavoritesApi.create).toHaveBeenCalledOnce();
    expect(mockFavoritesApi.create).toHaveBeenCalledWith(1);
    expect(mockFavoritesApi.delete).not.toHaveBeenCalled();
    expect(result).toEqual({
      meetingId: 1,
      isLiked: true,
    });
  });
});
