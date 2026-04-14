"use client";

import { ChevronLeft } from "@moum-zip/ui/icons";
import { toast } from "@ui/components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import { deleteMeetingAction, favoriteMeetingAction, joinMeetingAction } from "@/_pages/moim-detail/actions";
import LocationIcon from "@/_pages/moim-detail/assets/location.svg";
import { copyToClipboard } from "@/_pages/moim-detail/lib/copy-to-clipboard";
import { createMoimDetailInitialState, moimDetailReducer } from "@/_pages/moim-detail/model/moim-detail-reducer";
import type { InformationData, ParticipantData, PersonnelData, RecommendedMeetingData } from "@/entities/moim-detail";
import { ROUTES } from "@/shared/config/routes";

interface CurrentUser {
  id: number | null;
  name: string | null;
  image: string | null;
}

interface MoimDetailClientProps {
  meetingId: number;
  currentUser: CurrentUser;
  initialInformationData: InformationData;
  initialDescription: string;
  initialPersonnelData: PersonnelData;
  initialRecommendedMeetings: RecommendedMeetingData[];
  initialIsParticipating: boolean;
}

export const MoimDetailClient = ({
  meetingId,
  currentUser,
  initialInformationData,
  initialDescription,
  initialPersonnelData,
  initialRecommendedMeetings,
  initialIsParticipating,
}: MoimDetailClientProps) => {
  const router = useRouter();
  const loginRedirectPath = `/login?redirect=%2Fmoim-detail%2F${meetingId}`;

  const [state, dispatch] = useReducer(
    moimDetailReducer,
    {
      initialInformationData,
      initialPersonnelData,
      initialRecommendedMeetings,
      initialIsParticipating,
    },
    createMoimDetailInitialState,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: {
        informationData: initialInformationData,
        personnelData: initialPersonnelData,
        recommendedMeetings: initialRecommendedMeetings,
        isParticipating: initialIsParticipating,
      },
    });
  }, [initialInformationData, initialPersonnelData, initialRecommendedMeetings, initialIsParticipating]);

  const handleToggleMeetingLike = async (): Promise<boolean> => {
    if (state.pendingAction === "favorite") {
      return false;
    }

    if (!currentUser.id) {
      router.push(loginRedirectPath);
      return false;
    }

    dispatch({ type: "SET_PENDING_ACTION", payload: "favorite" });

    try {
      const result = await favoriteMeetingAction(state.informationData.id, state.informationData.isLiked);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return false;
      }

      dispatch({
        type: "TOGGLE_MEETING_LIKE",
        payload: result.data.isLiked,
      });

      return true;
    } catch {
      toast({ message: "좋아요 처리 중 오류가 발생했습니다.", size: "small" });
      return false;
    } finally {
      dispatch({ type: "SET_PENDING_ACTION", payload: "idle" });
    }
  };

  const handleParticipateToggle = async (targetMeetingId: number, nextParticipating: boolean) => {
    if (state.pendingAction === "join") {
      return;
    }

    const previousState = {
      informationData: state.informationData,
      personnelData: state.personnelData,
      isParticipating: state.isParticipating,
    };

    const optimisticParticipant: ParticipantData | null = currentUser.id
      ? {
          id: currentUser.id,
          name: currentUser.name ?? "나",
          image: currentUser.image ?? null,
        }
      : null;

    dispatch({ type: "SET_PENDING_ACTION", payload: "join" });

    dispatch({
      type: "OPTIMISTIC_PARTICIPATION",
      payload: {
        nextParticipating,
        participant: optimisticParticipant,
        userId: currentUser.id,
      },
    });

    try {
      const result = await joinMeetingAction(targetMeetingId, previousState.isParticipating);

      if (!result.ok) {
        dispatch({
          type: "ROLLBACK_PARTICIPATION",
          payload: previousState,
        });
        toast({ message: result.message, size: "small" });
        return;
      }

      router.refresh();
    } catch {
      dispatch({
        type: "ROLLBACK_PARTICIPATION",
        payload: previousState,
      });
      toast({ message: "참여 처리 중 오류가 발생했습니다.", size: "small" });
    } finally {
      dispatch({ type: "SET_PENDING_ACTION", payload: "idle" });
    }
  };

  const handleShare = async (targetMeetingId: number) => {
    const shareUrl = `${window.location.origin}/moim-detail/${targetMeetingId}`;

    const success = await copyToClipboard(shareUrl);

    toast({
      id: success ? "share-link" : "share-link-error",
      message: success ? "모임 링크가 복사되었습니다." : "링크 복사에 실패했습니다.",
      size: "small",
      duration: 2000,
    });
  };

  const handleEdit = (targetMeetingId: number) => {
    router.push(`${ROUTES.moimEdit}/${targetMeetingId}`);
  };

  const handleDelete = async (targetMeetingId: number) => {
    if (state.pendingAction === "delete") {
      return;
    }

    dispatch({ type: "SET_PENDING_ACTION", payload: "delete" });

    try {
      const result = await deleteMeetingAction(targetMeetingId);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return;
      }

      toast({ message: "모임이 삭제되었습니다.", size: "small" });
      router.replace(ROUTES.search);
    } catch {
      toast({ message: "모임 삭제 중 오류가 발생했습니다.", size: "small" });
    } finally {
      dispatch({ type: "SET_PENDING_ACTION", payload: "idle" });
    }
  };

  const handleLoginAction = () => {
    router.push(`/login?redirect=%2Fmoim-detail%2F${meetingId}`);
  };

  const handleToggleRecommendedLike = async (targetMeetingId: number): Promise<boolean> => {
    if (state.pendingRecommendedLikeIds.includes(targetMeetingId)) {
      return false;
    }

    if (!currentUser.id) {
      router.push(loginRedirectPath);
      return false;
    }

    const targetMeeting = state.recommendedMeetings.find((meeting) => meeting.id === targetMeetingId);

    if (!targetMeeting) {
      return false;
    }

    dispatch({
      type: "ADD_PENDING_RECOMMENDED_LIKE",
      payload: targetMeetingId,
    });

    try {
      const result = await favoriteMeetingAction(targetMeeting.id, targetMeeting.isLiked);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return false;
      }

      dispatch({
        type: "UPDATE_RECOMMENDED_MEETING_LIKE",
        payload: {
          meetingId: targetMeetingId,
          isLiked: result.data.isLiked,
        },
      });

      return true;
    } catch {
      toast({ message: "좋아요 처리 중 오류가 발생했습니다.", size: "small" });
      return false;
    } finally {
      dispatch({
        type: "REMOVE_PENDING_RECOMMENDED_LIKE",
        payload: targetMeetingId,
      });
    }
  };

  const viewType = state.informationData.viewerRole === "manager" ? "manager" : "member";

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-20 sm:px-6">
        <div className="flex items-center py-2">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }

              router.push(ROUTES.search);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-12">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
            <div className="relative aspect-[630/400] h-full w-full overflow-hidden rounded-[16px] md:rounded-[20px]">
              {state.informationData.image ? (
                <Image src={state.informationData.image} alt="모임 대표 이미지" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                  이미지 영역
                </div>
              )}
            </div>

            <div className="flex h-full w-full flex-col gap-4">
              <InformationContainer
                data={state.informationData}
                viewType={viewType}
                isLoggedIn={!!currentUser.id}
                isParticipating={state.isParticipating}
                onToggleLike={handleToggleMeetingLike}
                onParticipateToggle={handleParticipateToggle}
                onShare={handleShare}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLoginAction={handleLoginAction}
              />

              <PersonnelContainer data={state.personnelData} />
            </div>
          </section>

          <DescriptionSection description={initialDescription} />

          <section className="flex flex-col gap-4">
            <h2 className="font-semibold text-black text-xl leading-[1.4]">이런 모임은 어때요?</h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-4">
              {state.recommendedMeetings.map((meeting) => {
                const isRecommendedLikePending = state.pendingRecommendedLikeIds.includes(meeting.id);

                return (
                  <Link
                    key={meeting.id}
                    href={`${ROUTES.moimDetail}/${meeting.id}`}
                    className="block cursor-pointer"
                    onClick={(event) => {
                      const target = event.target as HTMLElement;

                      if (target.closest("button")) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <CompactCard
                      image={
                        meeting.image ? (
                          <Image src={meeting.image} alt={meeting.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs md:text-sm">
                            이미지 영역
                          </div>
                        )
                      }
                      deadlineLabel={meeting.deadlineLabel}
                      dateLabel={meeting.dateLabel}
                      timeLabel={meeting.timeLabel}
                      title={meeting.title}
                      locationIcon={<LocationIcon />}
                      locationText={meeting.locationText}
                      isLiked={meeting.isLiked}
                      onLike={() => {
                        if (isRecommendedLikePending) {
                          return false;
                        }

                        return handleToggleRecommendedLike(meeting.id);
                      }}
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
