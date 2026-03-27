"use server";

import { redirect } from "next/navigation";

import { getAuthenticatedApi, isAuthenticated } from "@/shared/api/auth-client";
import { ROUTES } from "@/shared/config/routes";

import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

export const createSearchFavoriteAction = async (meetingId: number) => {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const authedApi = await getAuthenticatedApi();

  return createSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
};

export const deleteSearchFavoriteAction = async (meetingId: number) => {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const authedApi = await getAuthenticatedApi();

  return deleteSearchFavorite({ meetingId }, { favoritesApi: authedApi.favorites });
};

export const redirectToMoimCreateAction = async () => {
  if (!(await isAuthenticated())) {
    redirect(ROUTES.login);
  }

  redirect(ROUTES.moimCreate);
};
