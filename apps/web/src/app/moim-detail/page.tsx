"use client";

import Image from "next/image";
import { useState } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import Thumbnail from "@/_pages/moim-detail/assets/img/thumbnail.png";
import LocationIcon from "@/_pages/moim-detail/assets/svg/location.svg";

const meetingDetail = {
  id: 1,
  title: "작은 독서 습관 만들기",
  description:
    "작은 독서 습관을 만들기 위해서 같이 열심히 해보실 사람을 구합니다~\n궁금한 점 있으시면 https://open.kakao.com/abcdefg12345 참여해서 질문주세요~",
  deadlineLabel: "오늘 21시 마감",
  dateLabel: "1월 7일",
  timeLabel: "17:30",
  category: "오프라인 · 스터디",
  isLiked: false,
};

const initialPersonnelData = {
  currentCount: 16,
  maxCount: 20,
  statusLabel: "개설확정",
  participants: [
    { id: 1, name: "김어진", avatarText: "김" },
    { id: 2, name: "권혁진", avatarText: "권" },
    { id: 3, name: "박혜빈", avatarText: "박" },
    { id: 4, name: "이해솔", avatarText: "이" },
    { id: 5, name: "최병찬", avatarText: "최" },
    { id: 6, name: "홍재영", avatarText: "홍" },
  ],
  extraCount: 12,
};

const initialRecommendedMeetings = [
  {
    id: 1,
    title: "React 스터디 같이 하실 분 구해요",
    locationText: "오프라인 · 스터디",
    liked: true,
  },
  {
    id: 2,
    title: "사이드 프로젝트 프론트엔드 팀원 모집",
    locationText: "온라인 · 프로젝트",
    liked: false,
  },
  {
    id: 3,
    title: "CS 면접 대비 스터디",
    locationText: "온라인 · 스터디",
    liked: false,
  },
  {
    id: 4,
    title: "AI 기반 서비스 개발 프로젝트",
    locationText: "오프라인 · 프로젝트",
    liked: false,
  },
];

export default function MoimDetailPage() {
  const [meetingInfo, setMeetingInfo] = useState(meetingDetail);
  const [recommendedMeetings, setRecommendedMeetings] = useState(initialRecommendedMeetings);
  const [isParticipating, setIsParticipating] = useState(false);

  const handleToggleMeetingLike = (id: number | string) => {
    setMeetingInfo((prev) => (prev.id === id ? { ...prev, isLiked: !prev.isLiked } : prev));
  };

  const handleParticipateToggle = (_id: number | string, nextParticipating: boolean) => {
    setIsParticipating(nextParticipating);
  };

  const handleShare = (_id: number | string) => {
    // TODO: 공유 기능 연결
  };

  const handleEdit = (_id: number | string) => {
    // TODO: 수정 기능 연결
  };

  const handleDelete = (_id: number | string) => {
    // TODO: 삭제 기능 연결
  };

  const handleLoginAction = () => {
    // TODO: 로그인 페이지 이동 로직 연결
  };

  const handleToggleRecommendedLike = (id: number) => {
    setRecommendedMeetings((prev) =>
      prev.map((meeting) => (meeting.id === id ? { ...meeting, liked: !meeting.liked } : meeting)),
    );
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <main className="mx-auto flex w-full max-w-[1312px] flex-col gap-[78px] px-5 pt-6 pb-24 md:px-6 md:pt-10 xl:px-10">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="relative h-full min-h-[190px] w-full overflow-hidden rounded-[20px] md:min-h-[260px] md:rounded-[32px] xl:min-h-[443px]">
            <Image
              src={Thumbnail}
              alt="모임 대표 이미지"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1279px) 100vw, 630px"
            />
          </div>

          <div className="flex h-full w-full flex-col gap-5">
            <InformationContainer
              data={{
                id: meetingInfo.id,
                deadlineLabel: meetingInfo.deadlineLabel,
                dateLabel: meetingInfo.dateLabel,
                timeLabel: meetingInfo.timeLabel,
                title: meetingInfo.title,
                category: meetingInfo.category,
                isLiked: meetingInfo.isLiked,
              }}
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

            <PersonnelContainer data={initialPersonnelData} />
          </div>
        </section>

        <DescriptionSection description={meetingInfo.description} />

        <section className="flex flex-col gap-5">
          <h2 className="font-semibold text-2xl text-black leading-[1.4]">이런 모임은 어때요?</h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 xl:grid-cols-4">
            {recommendedMeetings.map((meeting) => (
              <CompactCard
                key={meeting.id}
                image={
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs md:text-sm">
                    이미지 영역
                  </div>
                }
                deadlineLabel="오늘 21시 마감"
                dateLabel="1월 7일"
                timeLabel="17:30"
                title={meeting.title}
                locationIcon={<LocationIcon />}
                locationText={meeting.locationText}
                isLiked={meeting.liked}
                onLikeClick={() => handleToggleRecommendedLike(meeting.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
