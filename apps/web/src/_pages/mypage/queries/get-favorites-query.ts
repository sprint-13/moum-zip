"use client";

import { fetchMyFavorites } from "../model";

export function getFavoritesQueryOptions() {
  return {
    queryKey: ["mypage", "favorites"],
    queryFn: async () =>
      fetchMyFavorites({
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 10,
      }),
  } as const;
}
