import { LoadingIndicator } from "@ui/components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MoimDetailClient } from "@/_pages/moim-detail";
import { getMoimDetailMetadata } from "@/_pages/moim-detail/lib/get-moim-detail-metadata";
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

const parseMeetingId = (value: string) => {
  // "001", "1e3", " 12 " 같은 느슨한 숫자 형식을 막고 순수한 10진수 경로 id만 허용
  if (!/^[1-9]\d*$/.test(value)) {
    notFound();
  }

  const numericMeetingId = Number.parseInt(value, 10);

  // 메타데이터 생성 시에도 기존 페이지 렌더링과 동일한 notFound 정책을 따르도록 하기 위해 추가
  if (!Number.isSafeInteger(numericMeetingId)) {
    notFound();
  }

  return numericMeetingId;
};

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

const ERROR_FALLBACK = (
  <div className="flex h-full min-h-[60vh] items-center justify-center text-center">
    <p className="text-muted-foreground text-sm leading-relaxed">
      모임 정보를 불러오지 못했습니다.
      <br />
      잠시 후 다시 시도해 주세요.
    </p>
  </div>
);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isRecommendedMeetingItem = (value: unknown): value is RecommendedMeetingItem => {
  return isRecord(value) && "id" in value && typeof value.id === "number";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { meetingId } = await params;

  // page.tsx에선 export만 하고, 실제 메타데이터 구성은 moim-detail 헬퍼 함수에 위임
  return getMoimDetailMetadata(parseMeetingId(meetingId));
}

export default async function MoimDetailPage({ params }: PageProps) {
  const { meetingId } = await params;
  const numericMeetingId = parseMeetingId(meetingId);

  return (
    <Suspense fallback={<LoadingIndicator fullScreen text="모임 정보를 불러오는 중" />}>
      <MoimDetailContent meetingId={numericMeetingId} />
    </Suspense>
  );
}
