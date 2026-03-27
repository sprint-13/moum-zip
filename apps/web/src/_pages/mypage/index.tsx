"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useMemo, useState } from "react";
import { createFavorite, deleteFavorite, fetchMyFavorites, fetchMyMeetings } from "./api";
import { mapCreatedMeeting, mapFavoriteMeeting, mapJoinedMeeting } from "./model/mappers";
import type { CreatedFilterKey, MypageMoimCard, MypageProfile, MypageTabKey } from "./model/types";
import MoimCardList from "./ui/moim-card-list";
import ProfileSection from "./ui/profile-section";

type MoimTabKey = Exclude<MypageTabKey, "created">;

const createdMoimFilters: Array<{ key: CreatedFilterKey; label: string }> = [
  { key: "ongoing", label: "진행 중" },
  { key: "ended", label: "진행 종료" },
];

interface MypagePageProps {
  profile: MypageProfile;
  tabs: Array<{ key: MypageTabKey; label: string }>;
  moims: Record<MoimTabKey, MypageMoimCard[]>;
  createdMoims: Record<CreatedFilterKey, MypageMoimCard[]>;
  enableRemoteFetch?: boolean;
}

function applyFavoriteState(moims: MypageMoimCard[], favoriteMeetingIds: Set<string>) {
  return moims.map((moim) => ({
    ...moim,
    liked: favoriteMeetingIds.has(moim.id),
  }));
}

function updateLikedState(moims: MypageMoimCard[] | undefined, meetingId: string, nextLiked: boolean) {
  if (!moims) {
    return moims;
  }

  return moims.map((moim) => (moim.id === meetingId ? { ...moim, liked: nextLiked } : moim));
}

export default function MypagePage({ profile, tabs, moims, createdMoims, enableRemoteFetch = true }: MypagePageProps) {
  const [selectedTab, setSelectedTab] = useState<MypageTabKey>("joined");
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterKey>("ongoing");
  const isCreatedOngoing = createdFilter === "ongoing";
  const queryClient = useQueryClient();

  const {
    data: joinedMeetingCards = moims.joined,
    isError: isJoinedError,
    refetch: refetchJoinedMeetings,
  } = useQuery({
    queryKey: ["mypage", "meetings", "joined"],
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "joined",
        sortBy: "dateTime",
        sortOrder: "asc",
        size: 10,
      });

      return response.data.map((meeting, index) =>
        mapJoinedMeeting(meeting, index, favoriteMeetingIds.has(String(meeting.id))),
      );
    },
    // 첫 진입은 서버에서 받은 목록을 보여주고, 탭을 다시 열 때부터 클라이언트 조회를 재사용합니다.
    initialData: moims.joined,
    enabled: enableRemoteFetch && selectedTab === "joined",
  });

  const {
    data: createdMeetingCards = createdMoims[createdFilter],
    isError: isCreatedError,
    refetch: refetchCreatedMeetings,
  } = useQuery({
    queryKey: ["mypage", "meetings", "created", createdFilter],
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "created",
        completed: isCreatedOngoing ? "false" : "true",
        sortBy: "dateTime",
        sortOrder: isCreatedOngoing ? "asc" : "desc",
        size: 10,
      });

      return response.data.map((meeting, index) =>
        mapCreatedMeeting(meeting, index, favoriteMeetingIds.has(String(meeting.id))),
      );
    },
    enabled: enableRemoteFetch && selectedTab === "created",
  });

  const {
    data: favoriteList,
    isError: isLikedError,
    refetch: refetchLikedMeetings,
  } = useQuery({
    queryKey: ["mypage", "favorites"],
    queryFn: async () => {
      return fetchMyFavorites({
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 10,
      });
    },
    enabled: enableRemoteFetch,
  });

  const favoriteMeetingIds = useMemo(
    () =>
      new Set(
        (enableRemoteFetch
          ? favoriteList?.data.map((favorite) => String(favorite.meetingId))
          : moims.liked.map((moim) => moim.id)) ?? [],
      ),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const joinedMeetings = useMemo(
    () => applyFavoriteState(joinedMeetingCards, favoriteMeetingIds),
    [favoriteMeetingIds, joinedMeetingCards],
  );
  const createdMeetings = useMemo(
    () => applyFavoriteState(createdMeetingCards, favoriteMeetingIds),
    [createdMeetingCards, favoriteMeetingIds],
  );
  const likedMeetings = useMemo(
    () => (enableRemoteFetch ? (favoriteList?.data ?? []).map(mapFavoriteMeeting) : moims.liked),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const favoriteMutation = useMutation({
    mutationFn: async ({ meetingId, nextLiked }: { meetingId: number; nextLiked: boolean }) => {
      if (nextLiked) {
        return createFavorite(meetingId);
      }

      await deleteFavorite(meetingId);
      return null;
    },
    onMutate: async ({ meetingId, nextLiked }) => {
      const meetingIdString = String(meetingId);
      const previousJoined = queryClient.getQueryData<MypageMoimCard[]>(["mypage", "meetings", "joined"]);
      const previousCreatedOngoing = queryClient.getQueryData<MypageMoimCard[]>([
        "mypage",
        "meetings",
        "created",
        "ongoing",
      ]);
      const previousCreatedEnded = queryClient.getQueryData<MypageMoimCard[]>([
        "mypage",
        "meetings",
        "created",
        "ended",
      ]);
      const previousFavorites = queryClient.getQueryData<FavoriteList>(["mypage", "favorites"]);

      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "joined"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ongoing"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );
      queryClient.setQueryData<MypageMoimCard[]>(["mypage", "meetings", "created", "ended"], (current) =>
        updateLikedState(current, meetingIdString, nextLiked),
      );

      if (!nextLiked) {
        queryClient.setQueryData<FavoriteList>(["mypage", "favorites"], (current) =>
          current
            ? {
                ...current,
                data: current.data.filter((favorite) => favorite.meetingId !== meetingId),
              }
            : current,
        );
      }

      return {
        previousJoined,
        previousCreatedOngoing,
        previousCreatedEnded,
        previousFavorites,
      };
    },
    onSuccess: (data, { nextLiked }) => {
      if (nextLiked && data) {
        queryClient.setQueryData<FavoriteList>(["mypage", "favorites"], (current) => {
          if (!current) {
            return {
              data: [data],
              nextCursor: null,
              hasMore: false,
            };
          }

          if (current.data.some((favorite) => favorite.meetingId === data.meetingId)) {
            return current;
          }

          return {
            ...current,
            data: [data, ...current.data],
          };
        });
      }
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(["mypage", "meetings", "joined"], context.previousJoined);
      queryClient.setQueryData(["mypage", "meetings", "created", "ongoing"], context.previousCreatedOngoing);
      queryClient.setQueryData(["mypage", "meetings", "created", "ended"], context.previousCreatedEnded);
      queryClient.setQueryData(["mypage", "favorites"], context.previousFavorites);
    },
  });

  const handleToggleLike = (meetingId: string, nextLiked: boolean) => {
    if (!enableRemoteFetch) {
      return;
    }

    favoriteMutation.mutate({
      meetingId: Number(meetingId),
      nextLiked,
    });
  };

  return (
    <main className="no-scrollbar h-dvh overflow-y-auto bg-background px-4 py-8 text-foreground md:px-9 md:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-[80rem]">
        <section className="grid gap-8 xl:grid-cols-[17.625rem_59.875rem] xl:items-start xl:gap-10">
          <div className="space-y-8 xl:pt-4">
            <h1 className="font-bold text-[2rem] text-foreground leading-none tracking-[-0.03em]">마이페이지</h1>
            <div className="xl:pt-4">
              <ProfileSection profile={profile} />
            </div>
          </div>

          <Tabs
            defaultTab="joined"
            size="large"
            className="w-full min-w-0"
            onTabChange={(tab) => setSelectedTab(tab as MypageTabKey)}
          >
            <Tabs.List className="no-scrollbar w-full min-w-0 overflow-x-auto">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.key}
                  value={tab.key}
                  className="shrink-0 px-4 py-3 text-lg md:px-8 md:py-4 md:text-xl xl:px-10 xl:py-4 xl:text-xl"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="pt-8">
              <Tabs.Content value="joined">
                <MoimCardList
                  moims={joinedMeetings}
                  emptyLabel="아직 신청한 모임이 없어요"
                  isError={isJoinedError}
                  onRetry={() => void refetchJoinedMeetings()}
                  onToggleLike={handleToggleLike}
                />
              </Tabs.Content>

              <Tabs.Content value="created">
                <div className="space-y-8">
                  <div className="flex items-center gap-2">
                    {createdMoimFilters.map((filter) => {
                      const isSelected = createdFilter === filter.key;

                      return (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => setCreatedFilter(filter.key)}
                          className={cn(
                            "inline-flex h-10 min-w-20 items-center justify-center rounded-2xl px-4 font-semibold text-sm transition-colors",
                            isSelected ? "bg-slate-800 text-white" : "bg-gray-100 text-slate-800",
                          )}
                          aria-pressed={isSelected}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>

                  <MoimCardList
                    moims={createdMeetings}
                    emptyLabel={
                      createdFilter === "ongoing" ? "아직 진행 중인 모임이 없어요" : "아직 진행 종료된 모임이 없어요"
                    }
                    isError={isCreatedError}
                    onRetry={() => void refetchCreatedMeetings()}
                    onToggleLike={handleToggleLike}
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="liked">
                <MoimCardList
                  moims={likedMeetings}
                  emptyLabel="아직 찜한 모임이 없어요"
                  isError={isLikedError}
                  onRetry={() => void refetchLikedMeetings()}
                  onToggleLike={handleToggleLike}
                />
              </Tabs.Content>
            </div>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
