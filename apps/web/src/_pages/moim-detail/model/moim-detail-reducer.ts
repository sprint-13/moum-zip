import type { InformationData, ParticipantData, PersonnelData, RecommendedMeetingData } from "@/entities/moim-detail";

export type PendingAction = "idle" | "favorite" | "join" | "delete";

export interface MoimDetailState {
  informationData: InformationData;
  personnelData: PersonnelData;
  recommendedMeetings: RecommendedMeetingData[];
  isParticipating: boolean;
  pendingAction: PendingAction;
  pendingRecommendedLikeIds: number[];
}

type ParticipationSnapshot = Pick<MoimDetailState, "informationData" | "personnelData" | "isParticipating">;

export type MoimDetailAction =
  | {
      type: "RESET";
      payload: Pick<MoimDetailState, "informationData" | "personnelData" | "recommendedMeetings" | "isParticipating">;
    }
  | { type: "SET_PENDING_ACTION"; payload: PendingAction }
  | { type: "TOGGLE_MEETING_LIKE"; payload: boolean }
  | {
      type: "OPTIMISTIC_PARTICIPATION";
      payload: {
        nextParticipating: boolean;
        participant: ParticipantData | null;
        userId: number | null;
      };
    }
  | {
      type: "ROLLBACK_PARTICIPATION";
      payload: ParticipationSnapshot;
    }
  | { type: "ADD_PENDING_RECOMMENDED_LIKE"; payload: number }
  | { type: "REMOVE_PENDING_RECOMMENDED_LIKE"; payload: number }
  | {
      type: "UPDATE_RECOMMENDED_MEETING_LIKE";
      payload: {
        meetingId: number;
        isLiked: boolean;
      };
    };

export function createMoimDetailInitialState(params: {
  initialInformationData: InformationData;
  initialPersonnelData: PersonnelData;
  initialRecommendedMeetings: RecommendedMeetingData[];
  initialIsParticipating: boolean;
}): MoimDetailState {
  return {
    informationData: params.initialInformationData,
    personnelData: params.initialPersonnelData,
    recommendedMeetings: params.initialRecommendedMeetings,
    isParticipating: params.initialIsParticipating,
    pendingAction: "idle",
    pendingRecommendedLikeIds: [],
  };
}

export function moimDetailReducer(state: MoimDetailState, action: MoimDetailAction): MoimDetailState {
  switch (action.type) {
    case "RESET":
      return {
        informationData: action.payload.informationData,
        personnelData: action.payload.personnelData,
        recommendedMeetings: action.payload.recommendedMeetings,
        isParticipating: action.payload.isParticipating,
        pendingAction: "idle",
        pendingRecommendedLikeIds: [],
      };

    case "SET_PENDING_ACTION":
      return {
        ...state,
        pendingAction: action.payload,
      };

    case "TOGGLE_MEETING_LIKE":
      return {
        ...state,
        informationData: {
          ...state.informationData,
          isLiked: action.payload,
        },
      };

    case "OPTIMISTIC_PARTICIPATION": {
      const { nextParticipating, participant, userId } = action.payload;

      const nextCurrentParticipants = nextParticipating
        ? state.personnelData.currentParticipants + 1
        : Math.max(state.personnelData.currentParticipants - 1, 0);

      const nextParticipants = (() => {
        if (nextParticipating) {
          if (!participant) {
            return state.personnelData.participants;
          }

          return [
            ...state.personnelData.participants.filter(
              (existingParticipant) => existingParticipant.id !== participant.id,
            ),
            participant,
          ];
        }

        if (!userId) {
          return state.personnelData.participants;
        }

        return state.personnelData.participants.filter((existingParticipant) => existingParticipant.id !== userId);
      })();

      return {
        ...state,
        isParticipating: nextParticipating,
        informationData: {
          ...state.informationData,
          isJoined: nextParticipating,
          actionState: {
            ...state.informationData.actionState,
            canJoin: !nextParticipating,
            canCancelJoin: nextParticipating,
          },
        },
        personnelData: {
          ...state.personnelData,
          currentParticipants: nextCurrentParticipants,
          participants: nextParticipants,
          extraCount: Math.max(nextCurrentParticipants - nextParticipants.length, 0),
        },
      };
    }

    case "ROLLBACK_PARTICIPATION":
      return {
        ...state,
        informationData: action.payload.informationData,
        personnelData: action.payload.personnelData,
        isParticipating: action.payload.isParticipating,
        pendingAction: "idle",
      };

    case "ADD_PENDING_RECOMMENDED_LIKE":
      return {
        ...state,
        pendingRecommendedLikeIds: [...state.pendingRecommendedLikeIds, action.payload],
      };

    case "REMOVE_PENDING_RECOMMENDED_LIKE":
      return {
        ...state,
        pendingRecommendedLikeIds: state.pendingRecommendedLikeIds.filter((id) => id !== action.payload),
      };

    case "UPDATE_RECOMMENDED_MEETING_LIKE":
      return {
        ...state,
        recommendedMeetings: state.recommendedMeetings.map((meeting) =>
          meeting.id === action.payload.meetingId
            ? {
                ...meeting,
                isLiked: action.payload.isLiked,
              }
            : meeting,
        ),
      };

    default:
      return state;
  }
}
