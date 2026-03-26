import { api } from "@/shared/api";

interface DeleteSearchFavoriteInput {
  meetingId: number;
}

interface DeleteSearchFavoriteDeps {
  favoritesApi?: Pick<typeof api.favorites, "delete">;
}

export const deleteSearchFavorite = async (
  { meetingId }: DeleteSearchFavoriteInput,
  { favoritesApi = api.favorites }: DeleteSearchFavoriteDeps = {},
) => {
  await favoritesApi.delete(meetingId);

  return {
    meetingId,
    isLiked: false,
  };
};
