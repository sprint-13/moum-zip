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
} from "@/entities/moim-detail/model/mapper";
import { getApi } from "@/shared/api/server";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

interface MoimDetailContentProps {
  meetingId: number;
}

async function MoimDetailContent({ meetingId }: MoimDetailContentProps) {
  const currentUserResult = await getCurrentUser();
  const currentUserId = currentUserResult.ok ? currentUserResult.data.id : null;

  const apiClient = await getApi();

  try {
    const [meetingDetailResponse, participantsResponse, meetingsResponse] = await Promise.all([
      apiClient.meetings.getDetail(meetingId),
      apiClient.meetings.participants.getList(meetingId),
      apiClient.meetings.getList(),
    ]);

    const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;

    const participantsList = "data" in participantsResponse ? participantsResponse.data : participantsResponse;

    const meetingsList = "data" in meetingsResponse ? meetingsResponse.data : meetingsResponse;

    if (!meetingDetail || !participantsList || !meetingsList) {
      return <div>모임 정보를 표시할 수 없습니다.</div>;
    }

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

    const recommendedMeetings = [...meetingsList.data]
      .filter((meeting) => meeting.id !== meetingId)
      .sort((a, b) => {
        const aSameType = a.type === meetingDetail.type ? 1 : 0;
        const bSameType = b.type === meetingDetail.type ? 1 : 0;

        if (aSameType !== bSameType) {
          return bSameType - aSameType;
        }

        const aSameHost = a.hostId === meetingDetail.hostId ? 1 : 0;
        const bSameHost = b.hostId === meetingDetail.hostId ? 1 : 0;

        if (aSameHost !== bSameHost) {
          return bSameHost - aSameHost;
        }

        const aDeadline = a.registrationEnd ? new Date(a.registrationEnd).getTime() : Number.MAX_SAFE_INTEGER;
        const bDeadline = b.registrationEnd ? new Date(b.registrationEnd).getTime() : Number.MAX_SAFE_INTEGER;

        if (aDeadline !== bDeadline) {
          return aDeadline - bDeadline;
        }

        return b.participantCount - a.participantCount;
      })
      .slice(0, 4)
      .map((meeting) => mapMeetingToRecommendedMeetingData(meeting));

    return (
      <MoimDetailClient
        meetingId={meetingId}
        currentUserId={currentUserId}
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
