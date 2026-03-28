"use server";

import { redirect } from "next/navigation";
import { getApiClient, isAuth } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";
import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

export const createSearchFavoriteAction = async (meetingId: number) => {
  const client = await getApiClient();

  return createSearchFavorite({ meetingId }, { favoritesApi: client.favorites });
};

export const deleteSearchFavoriteAction = async (meetingId: number) => {
  const client = await getApiClient();

  return deleteSearchFavorite({ meetingId }, { favoritesApi: client.favorites });
};

export const redirectToMoimCreateAction = async () => {
  const authenticated = await isAuth();

  if (!authenticated) {
    redirect(ROUTES.login);
  }

  redirect(ROUTES.moimCreate);
};
