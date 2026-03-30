import type { api } from "@/shared/api";

interface DeleteSearchFavoriteInput {
  meetingId: number;
}

interface DeleteSearchFavoriteDeps {
  favoritesApi: Pick<typeof api.favorites, "delete">;
}

export const deleteSearchFavorite = async (
  { meetingId }: DeleteSearchFavoriteInput,
  { favoritesApi }: DeleteSearchFavoriteDeps,
) => {
  const timerLabel = `[search] DELETE /favorites meetingId=${meetingId}`;
  console.time(timerLabel);
  await favoritesApi.delete(meetingId).finally(() => {
    console.timeEnd(timerLabel);
  });

  return {
    meetingId,
    isLiked: false,
  };
};
