"use server";

import { redirect } from "next/navigation";
import { getApi } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";
import { createSearchFavorite } from "./use-cases/create-search-favorite";
import { deleteSearchFavorite } from "./use-cases/delete-search-favorite";

export const createSearchFavoriteAction = async (meetingId: number) => {
  const api = await getApi();

  return createSearchFavorite({ meetingId }, { favoritesApi: api.favorites });
};

export const deleteSearchFavoriteAction = async (meetingId: number) => {
  const api = await getApi();

  return deleteSearchFavorite({ meetingId }, { favoritesApi: api.favorites });
};

export const redirectToMoimCreateAction = async () => {
  const api = await getApi();

  void api; // TODO: 대체 방법 고민 // 인증 확인용 — 미인증 시 onAuthFailed에서 redirect
  redirect(ROUTES.moimCreate);
};
