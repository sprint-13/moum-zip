"use client";

import { toast } from "@ui/components";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import { deleteMeetingAction, favoriteMeetingAction, joinMeetingAction } from "@/_pages/moim-detail/actions";
import { copyToClipboard } from "@/_pages/moim-detail/lib/copy-to-clipboard";
import { createMoimDetailInitialState, moimDetailReducer } from "@/_pages/moim-detail/model/moim-detail-reducer";
import type { InformationData, ParticipantData, PersonnelData } from "@/entities/moim-detail";
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
  initialPersonnelData: PersonnelData;
  initialIsParticipating: boolean;
}

export const MoimDetailClient = ({
  meetingId,
  currentUser,
  initialInformationData,
  initialPersonnelData,
  initialIsParticipating,
}: MoimDetailClientProps) => {
  const router = useRouter();
  const loginRedirectPath = `/login?redirect=%2Fmoim-detail%2F${meetingId}`;

  const [state, dispatch] = useReducer(
    moimDetailReducer,
    {
      initialInformationData,
      initialPersonnelData,
      initialRecommendedMeetings: [],
      initialIsParticipating,
    },
    createMoimDetailInitialState,
  );

  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: {
        informationData: initialInformationData,
        personnelData: initialPersonnelData,
        recommendedMeetings: [],
        isParticipating: initialIsParticipating,
      },
    });
  }, [initialInformationData, initialPersonnelData, initialIsParticipating]);

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
    router.push(loginRedirectPath);
  };

  const viewType = state.informationData.viewerRole === "manager" ? "manager" : "member";

  return (
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
  );
};
