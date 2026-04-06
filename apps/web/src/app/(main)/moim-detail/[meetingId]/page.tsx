import { LoadingIndicator } from "@ui/components";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MoimDetailClient } from "@/_pages/moim-detail";
import { getCurrentUser } from "@/_pages/moim-detail/actions";
import {
  getIsJoined,
  mapMeetingDetailToDescription,
  mapMeetingDetailToInformationData,
  mapMeetingDetailToPersonnelBaseData,
  mapMeetingToRecommendedMeetingData,
  mapParticipantsToParticipantData,
  sortRecommendedMeetings,
} from "@/entities/moim-detail";
import { getApi } from "@/shared/api/server";

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

type MeetingsPageResponse<T> = {
  data: T[];
  nextCursor: string | null;
};

function isRecommendedMeetingItem(value: unknown): value is RecommendedMeetingItem {
  return !!value && typeof value === "object" && "id" in value;
}

function parseMeetingsPage<T>(response: unknown): MeetingsPageResponse<T> {
  const resolved = response && typeof response === "object" && "data" in response ? response.data : response;

  if (
    resolved &&
    typeof resolved === "object" &&
    "data" in resolved &&
    Array.isArray((resolved as { data: unknown }).data)
  ) {
    return {
      data: (resolved as { data: T[] }).data,
      nextCursor:
        "nextCursor" in resolved && typeof (resolved as { nextCursor?: unknown }).nextCursor === "string"
          ? (resolved as { nextCursor: string }).nextCursor
          : null,
    };
  }

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
}

async function getAllMeetings(apiClient: Awaited<ReturnType<typeof getApi>>) {
  const allMeetings: RecommendedMeetingItem[] = [];
  let cursor: string | null = null;

  while (true) {
    const response = await apiClient.meetings.getList(
      cursor
        ? {
            cursor,
          }
        : undefined,
    );

    const { data, nextCursor } = parseMeetingsPage<RecommendedMeetingItem>(response);

    allMeetings.push(...data.filter(isRecommendedMeetingItem));

    if (!nextCursor) {
      break;
    }

    cursor = nextCursor;
  }

  return allMeetings;
}

async function MoimDetailContent({ meetingId }: MoimDetailContentProps) {
  const currentUserResult = await getCurrentUser();

  const currentUser = currentUserResult.ok
    ? currentUserResult.data
    : {
        id: null,
        name: null,
        image: null,
      };

  const currentUserId = currentUser.id;
  const apiClient = await getApi();

  try {
    const [meetingDetailResponse, participantsResponse, allMeetings] = await Promise.all([
      apiClient.meetings.getDetail(meetingId),
      apiClient.meetings.participants.getList(meetingId),
      getAllMeetings(apiClient),
    ]);

    const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;
    const participantsList = "data" in participantsResponse ? participantsResponse.data : participantsResponse;

    if (!meetingDetail || !participantsList || allMeetings.length === 0) {
      return <div>모임 정보를 표시할 수 없습니다.</div>;
    }

    const sortableMeetingDetail: CurrentMeetingSortable = {
      id: meetingDetail.id,
      type: meetingDetail.type,
      region: meetingDetail.region,
      hostId: meetingDetail.hostId,
    };

    const isJoined = getIsJoined(participantsList, currentUserId);

    const informationData = mapMeetingDetailToInformationData({
      meeting: meetingDetail,
      currentUserId,
      isJoined,
    });

    const description = mapMeetingDetailToDescription(meetingDetail);

    const personnelBaseData = mapMeetingDetailToPersonnelBaseData(meetingDetail);
    const mappedParticipants = mapParticipantsToParticipantData(participantsList);

    const personnelData = {
      ...personnelBaseData,
      participants: mappedParticipants,
      extraCount: Math.max(meetingDetail.participantCount - mappedParticipants.length, 0),
    };

    const recommendedMeetings = sortRecommendedMeetings(allMeetings, sortableMeetingDetail).map((meeting) =>
      mapMeetingToRecommendedMeetingData(meeting),
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
    return <div>모임 정보를 표시할 수 없습니다.</div>;
  }
}

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
