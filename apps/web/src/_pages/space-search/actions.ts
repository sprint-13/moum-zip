"use server";

import { revalidatePath } from "next/cache";

import { getAuthenticatedApi } from "@/shared/api/auth-client";

import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

export const createSearchFavoriteAction = async (meetingId: number) => {
  const authedApi = await getAuthenticatedApi();

  await createSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
  revalidatePath("/search");
};

export const deleteSearchFavoriteAction = async (meetingId: number) => {
  const authedApi = await getAuthenticatedApi();

  await deleteSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
  revalidatePath("/search");
};
