import type { api } from "@/shared/api";

interface CreateSearchFavoriteInput {
  meetingId: number;
}

interface CreateSearchFavoriteDeps {
  favoritesApi: Pick<typeof api.favorites, "create">;
}

export const createSearchFavorite = async (
  { meetingId }: CreateSearchFavoriteInput,
  { favoritesApi }: CreateSearchFavoriteDeps,
) => {
  const timerLabel = `[search] POST /favorites meetingId=${meetingId}`;
  console.time(timerLabel);
  await favoritesApi.create(meetingId).finally(() => {
    console.timeEnd(timerLabel);
  });

  return {
    meetingId,
    isLiked: true,
  };
};
