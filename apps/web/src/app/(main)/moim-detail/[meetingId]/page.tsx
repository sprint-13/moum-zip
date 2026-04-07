import { LoadingIndicator } from "@ui/components";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MoimDetailClient } from "@/_pages/moim-detail";
import {
  getIsJoined,
  mapMeetingDetailToDescription,
  mapMeetingDetailToInformationData,
  mapMeetingDetailToPersonnelBaseData,
  mapMeetingToRecommendedMeetingData,
  mapParticipantsToParticipantData,
  sortRecommendedMeetings,
} from "@/entities/moim-detail";
import { getCurrentUser } from "@/features/moim-detail/use-cases/get-current-user";
import { getApi, isAuth } from "@/shared/api/server";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

interface MoimDetailContentProps {
  meetingId: number;
}

type RecommendedMeetingItem = Parameters<typeof mapMeetingToRecommendedMeetingData>[0];

type CurrentMeetingSortable = {
  id: number;
  type?: string | null;
  region?: string | null;
  hostId?: number | null;
};

type CurrentUserData = {
  id: number | null;
  name: string | null;
  image: string | null;
};

type MeetingsPageResponse<T> = {
  data: T[];
  nextCursor: string | null;
};

type ResponseWithArrayData = {
  data: unknown[];
  nextCursor?: unknown;
};

const EMPTY_USER: CurrentUserData = {
  id: null,
  name: null,
  image: null,
};

const ERROR_FALLBACK = <div>모임 정보를 표시할 수 없습니다.</div>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isRecommendedMeetingItem = (value: unknown): value is RecommendedMeetingItem => {
  return isRecord(value) && "id" in value;
};

const hasArrayData = (value: unknown): value is ResponseWithArrayData => {
  return isRecord(value) && "data" in value && Array.isArray(value.data);
};

const parseMeetingsPage = <T,>(response: unknown): MeetingsPageResponse<T> => {
  if (hasArrayData(response)) {
    return {
      data: response.data as T[],
      nextCursor: typeof response.nextCursor === "string" ? response.nextCursor : null,
    };
  }

  if (isRecord(response) && "data" in response && hasArrayData(response.data)) {
    return {
      data: response.data.data as T[],
      nextCursor:
        typeof response.data.nextCursor === "string"
          ? response.data.nextCursor
          : typeof response.nextCursor === "string"
            ? response.nextCursor
            : null,
    };
  }

  const resolved = isRecord(response) && "data" in response ? response.data : response;

  if (Array.isArray(resolved)) {
    return {
      data: resolved as T[],
      nextCursor: null,
    };
  }

  return {
    data: [],
    nextCursor: null,
  };
};

const getAllMeetings = async (apiClient: Awaited<ReturnType<typeof getApi>>) => {
  const allMeetings: RecommendedMeetingItem[] = [];
  let cursor: string | null = null;

  while (true) {
    const response = await apiClient.meetings.getList(cursor ? { cursor } : undefined);
    const { data, nextCursor } = parseMeetingsPage<RecommendedMeetingItem>(response);

    allMeetings.push(...data.filter(isRecommendedMeetingItem));

    if (!nextCursor) {
      break;
    }

    cursor = nextCursor;
  }

  return allMeetings;
};

const getCurrentUserOrEmpty = async (apiClient: Awaited<ReturnType<typeof getApi>>): Promise<CurrentUserData> => {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return EMPTY_USER;
  }

  try {
    return await getCurrentUser({
      getUser: async () => {
        const response = await apiClient.user.getUser();
        return response.data ?? response;
      },
    });
  } catch {
    return EMPTY_USER;
  }
};

const MoimDetailContent = async ({ meetingId }: MoimDetailContentProps) => {
  const apiClient = await getApi();
  const currentUser = await getCurrentUserOrEmpty(apiClient);

  try {
    const [meetingDetailResult, participantsResult, allMeetingsResult] = await Promise.allSettled([
      apiClient.meetings.getDetail(meetingId),
      apiClient.meetings.participants.getList(meetingId),
      getAllMeetings(apiClient),
    ]);

    if (meetingDetailResult.status !== "fulfilled" || participantsResult.status !== "fulfilled") {
      return ERROR_FALLBACK;
    }

    const meetingDetailResponse = meetingDetailResult.value;
    const participantsResponse = participantsResult.value;
    const allMeetings = allMeetingsResult.status === "fulfilled" ? allMeetingsResult.value : [];

    const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;
    const participantsList = "data" in participantsResponse ? participantsResponse.data : participantsResponse;

    if (!meetingDetail || !participantsList) {
      return ERROR_FALLBACK;
    }

    const isJoined = getIsJoined(participantsList, currentUser.id);

    const informationData = mapMeetingDetailToInformationData({
      meeting: meetingDetail,
      currentUserId: currentUser.id,
      isJoined,
    });

    const description = mapMeetingDetailToDescription(meetingDetail);
    const mappedParticipants = mapParticipantsToParticipantData(participantsList);

    const personnelData = {
      ...mapMeetingDetailToPersonnelBaseData(meetingDetail),
      participants: mappedParticipants,
      extraCount: Math.max(meetingDetail.participantCount - mappedParticipants.length, 0),
    };

    const sortableMeetingDetail: CurrentMeetingSortable = {
      id: meetingDetail.id,
      type: meetingDetail.type,
      region: meetingDetail.region,
      hostId: meetingDetail.hostId,
    };

    const recommendedMeetings = sortRecommendedMeetings(allMeetings, sortableMeetingDetail).map(
      mapMeetingToRecommendedMeetingData,
    );

    return (
      <MoimDetailClient
        meetingId={meetingId}
        currentUser={currentUser}
        initialInformationData={informationData}
        initialDescription={description}
        initialPersonnelData={personnelData}
        initialRecommendedMeetings={recommendedMeetings}
        initialIsParticipating={isJoined}
      />
    );
  } catch {
    return ERROR_FALLBACK;
  }
};

export default async function MoimDetailPage({ params }: PageProps) {
  const { meetingId } = await params;
  const numericMeetingId = Number(meetingId);

  if (Number.isNaN(numericMeetingId)) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingIndicator fullScreen text="모임 정보를 불러오는 중" />}>
      <MoimDetailContent meetingId={numericMeetingId} />
    </Suspense>
  );
}
