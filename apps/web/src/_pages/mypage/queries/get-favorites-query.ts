"use client";

import type { FavoriteList } from "@moum-zip/api";
import { fetchAllMyFavorites } from "../model";

export const getFavoritesQueryOptions = (initialData?: FavoriteList) => {
  return {
    queryKey: ["mypage", "favorites"],
    queryFn: async () =>
      fetchAllMyFavorites({
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    initialData,
  } as const;
};
