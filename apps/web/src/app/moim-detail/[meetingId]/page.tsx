"use client";

import { use, useEffect, useState } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import LocationIcon from "@/_pages/moim-detail/assets/svg/location.svg";
import {
  mapMeetingDetailToDescription,
  mapMeetingDetailToInformationData,
  mapMeetingDetailToPersonnelBaseData,
  mapMeetingToRecommendedMeetingData,
  mapParticipantsToParticipantData,
} from "@/_pages/moim-detail/model/mapper";
import type { InformationData, PersonnelData, RecommendedMeetingData } from "@/_pages/moim-detail/model/types";
import { api } from "@/shared/api";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MoimDetailPage({ params }: PageProps) {
  const { meetingId } = use(params);
  const numericMeetingId = Number(meetingId);

  const [informationData, setInformationData] = useState<InformationData | null>(null);
  const [description, setDescription] = useState("");
  const [personnelData, setPersonnelData] = useState<PersonnelData | null>(null);
  const [recommendedMeetings, setRecommendedMeetings] = useState<RecommendedMeetingData[]>([]);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    if (Number.isNaN(numericMeetingId)) {
      return;
    }

    const fetchMeetingDetail = async () => {
      const [meetingDetailResponse, participantsResponse, meetingsResponse] = await Promise.all([
        api.meetings.getDetail(numericMeetingId),
        api.meetings.participants.getList(numericMeetingId),
        api.meetings.getList(),
      ]);

      const meetingDetail = meetingDetailResponse.data ?? meetingDetailResponse;
      const participantsList = participantsResponse.data ?? participantsResponse;
      const meetingsList = meetingsResponse.data ?? meetingsResponse;

      const mappedInformationData = mapMeetingDetailToInformationData(meetingDetail);
      const mappedDescription = mapMeetingDetailToDescription(meetingDetail);
      const personnelBaseData = mapMeetingDetailToPersonnelBaseData(meetingDetail);
      const mappedParticipants = mapParticipantsToParticipantData(participantsList);

      setInformationData(mappedInformationData);
      setDescription(mappedDescription);
      setPersonnelData({
        ...personnelBaseData,
        participants: mappedParticipants,
        extraCount: 0,
      });

      setRecommendedMeetings(
        [...meetingsList.data]
          .filter((meeting) => meeting.id !== numericMeetingId)
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
          .map(mapMeetingToRecommendedMeetingData),
      );
    };

    fetchMeetingDetail();
  }, [numericMeetingId]);

  const handleToggleMeetingLike = () => {
    setInformationData((prev) => (prev ? { ...prev, isLiked: !prev.isLiked } : prev));
  };

  const handleParticipateToggle = (_id: number, nextParticipating: boolean) => {
    setIsParticipating(nextParticipating);
  };

  const handleShare = (_id: number) => {
    // TODO: 공유 기능 연결
  };

  const handleEdit = (_id: number) => {
    // TODO: 수정 기능 연결
  };

  const handleDelete = (_id: number) => {
    // TODO: 삭제 기능 연결
  };

  const handleLoginAction = () => {
    // TODO: 로그인 페이지 이동 로직 연결
  };

  const handleToggleRecommendedLike = (id: number) => {
    setRecommendedMeetings((prev) =>
      prev.map((meeting) => (meeting.id === id ? { ...meeting, isLiked: !meeting.isLiked } : meeting)),
    );
  };

  if (Number.isNaN(numericMeetingId)) {
    return <div>유효하지 않은 meetingId입니다.</div>;
  }

  if (!informationData || !personnelData) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <main className="mx-auto flex w-full max-w-[1312px] flex-col gap-[78px] px-5 pt-6 pb-24 md:px-6 md:pt-10 xl:px-10">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="relative h-full min-h-[190px] w-full overflow-hidden rounded-[20px] md:min-h-[260px] md:rounded-[32px] xl:min-h-[443px]">
            {informationData.image ? (
              <img src={informationData.image} alt="모임 대표 이미지" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                이미지 영역
              </div>
            )}
          </div>

          <div className="flex h-full w-full flex-col gap-5">
            <InformationContainer
              data={informationData}
              viewType="manager"
              isLoggedIn={false}
              isParticipating={isParticipating}
              onToggleLike={handleToggleMeetingLike}
              onParticipateToggle={handleParticipateToggle}
              onShare={handleShare}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLoginAction={handleLoginAction}
            />

            <PersonnelContainer data={personnelData} />
          </div>
        </section>

        <DescriptionSection description={description} />

        <section className="flex flex-col gap-5">
          <h2 className="font-semibold text-2xl text-black leading-[1.4]">이런 모임은 어때요?</h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 xl:grid-cols-4">
            {recommendedMeetings.map((meeting) => (
              <CompactCard
                key={meeting.id}
                image={
                  meeting.image ? (
                    <img src={meeting.image} alt={meeting.title} className="h-full w-full object-cover" />
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
                onLikeClick={() => handleToggleRecommendedLike(meeting.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
