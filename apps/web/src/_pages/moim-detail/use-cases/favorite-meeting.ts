import type { api } from "@/shared/api";

interface FavoriteMeetingInput {
  meetingId: number;
  isLiked: boolean;
}

interface FavoriteMeetingDeps {
  favoritesApi: Pick<typeof api.favorites, "create" | "delete">;
}

export const favoriteMeeting = async (
  { meetingId, isLiked }: FavoriteMeetingInput,
  { favoritesApi }: FavoriteMeetingDeps,
) => {
  if (isLiked) {
    await favoritesApi.delete(meetingId);
  } else {
    await favoritesApi.create(meetingId);
  }

  return {
    meetingId,
    isLiked: !isLiked,
  };
};
