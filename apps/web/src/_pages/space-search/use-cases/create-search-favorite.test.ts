import { describe, expect, it, vi } from "vitest";

import { createSearchFavorite } from "./create-search-favorite";

describe("createSearchFavorite", () => {
  it("favorites create API를 호출한다", async () => {
    const mockFavoritesApi = {
      create: vi.fn().mockResolvedValue(undefined),
    };

    const result = await createSearchFavorite({ meetingId: 361 }, { favoritesApi: mockFavoritesApi });

    expect(mockFavoritesApi.create).toHaveBeenCalledWith(361);
    expect(result).toEqual({
      meetingId: 361,
      isLiked: true,
    });
  });
});
