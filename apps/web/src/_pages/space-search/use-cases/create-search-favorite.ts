import { api } from "@/shared/api";

interface CreateSearchFavoriteInput {
  meetingId: number;
}

interface CreateSearchFavoriteDeps {
  favoritesApi?: Pick<typeof api.favorites, "create">;
}

export const createSearchFavorite = async (
  { meetingId }: CreateSearchFavoriteInput,
  { favoritesApi = api.favorites }: CreateSearchFavoriteDeps = {},
) => {
  await favoritesApi.create(meetingId);

  return {
    meetingId,
    isLiked: true,
  };
};
