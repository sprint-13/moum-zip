"use server";

import { redirect } from "next/navigation";
import { getApiClient } from "@/shared/api/server";
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
  const client = await getApiClient();

  void client; // 인증 확인용 — 미인증 시 onAuthFailed에서 redirect
  redirect(ROUTES.moimCreate);
};
