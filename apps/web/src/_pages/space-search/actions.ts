"use server";

import { getApi, isAuth } from "@/shared/api/server";

import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

type FavoriteActionResult =
  | {
      error: "UNAUTHORIZED";
      ok: false;
    }
  | {
      data: {
        isLiked: boolean;
        meetingId: number;
      };
      ok: true;
    };

export const createSearchFavoriteAction = async (meetingId: number): Promise<FavoriteActionResult> => {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return {
      error: "UNAUTHORIZED",
      ok: false,
    };
  }

  const api = await getApi();
  const result = await createSearchFavorite({ meetingId }, { favoritesApi: api.favorites });

  return {
    data: result,
    ok: true,
  };
};

export const deleteSearchFavoriteAction = async (meetingId: number): Promise<FavoriteActionResult> => {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return {
      error: "UNAUTHORIZED",
      ok: false,
    };
  }

  const api = await getApi();
  const result = await deleteSearchFavorite({ meetingId }, { favoritesApi: api.favorites });

  return {
    data: result,
    ok: true,
  };
};
