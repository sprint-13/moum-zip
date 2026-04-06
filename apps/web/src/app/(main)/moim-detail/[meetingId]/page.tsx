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

const EMPTY_USER: CurrentUserData = {
  id: null,
  name: null,
  image: null,
};

const ERROR_FALLBACK = <div>모임 정보를 표시할 수 없습니다.</div>;

const isRecommendedMeetingItem = (value: unknown): value is RecommendedMeetingItem => {
  return !!value && typeof value === "object" && "id" in value;
};

const parseMeetingsPage = <T,>(response: unknown): MeetingsPageResponse<T> => {
  const resolved = response && typeof response === "object" && "data" in response ? response.data : response;

  if (resolved && typeof resolved === "object" && "data" in resolved && Array.isArray((resolved as any).data)) {
    return {
      data: (resolved as any).data,
      nextCursor: typeof (resolved as any).nextCursor === "string" ? (resolved as any).nextCursor : null,
    };
  }

  if (Array.isArray(resolved)) {
    return { data: resolved as T[], nextCursor: null };
  }

  return { data: [], nextCursor: null };
};

const getAllMeetings = async (apiClient: Awaited<ReturnType<typeof getApi>>) => {
  const allMeetings: RecommendedMeetingItem[] = [];
  let cursor: string | null = null;

  while (true) {
    const response = await apiClient.meetings.getList(cursor ? { cursor } : undefined);

    const { data, nextCursor } = parseMeetingsPage<RecommendedMeetingItem>(response);

    allMeetings.push(...data.filter(isRecommendedMeetingItem));

    if (!nextCursor) break;

    cursor = nextCursor;
  }

  return allMeetings;
};

const getCurrentUserOrEmpty = async (apiClient: Awaited<ReturnType<typeof getApi>>): Promise<CurrentUserData> => {
  const { authenticated } = await isAuth();

  if (!authenticated) return EMPTY_USER;

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
    const [meetingDetailResponse, participantsResponse, allMeetings] = await Promise.all([
      apiClient.meetings.getDetail(meetingId),
      apiClient.meetings.participants.getList(meetingId),
      getAllMeetings(apiClient),
    ]);

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
