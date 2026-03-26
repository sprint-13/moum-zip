"use server";

import { getAuthenticatedApi } from "@/shared/api/auth-client";

import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

export const createSearchFavoriteAction = async (meetingId: number) => {
  const authedApi = await getAuthenticatedApi();

  return createSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
};

export const deleteSearchFavoriteAction = async (meetingId: number) => {
  const authedApi = await getAuthenticatedApi();

  return deleteSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
};
