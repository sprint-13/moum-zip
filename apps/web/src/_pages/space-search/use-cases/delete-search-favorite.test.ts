import { describe, expect, it, vi } from "vitest";

import { deleteSearchFavorite } from "./delete-search-favorite";

describe("deleteSearchFavorite", () => {
  it("favorites delete API를 호출한다", async () => {
    const mockFavoritesApi = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const result = await deleteSearchFavorite({ meetingId: 361 }, { favoritesApi: mockFavoritesApi });

    expect(mockFavoritesApi.delete).toHaveBeenCalledWith(361);
    expect(result).toEqual({
      meetingId: 361,
      isLiked: false,
    });
  });
});
