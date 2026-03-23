"use client";

import { Copy } from "@moum-zip/ui/icons";
import Image from "next/image";
import { useState } from "react";
import recruitmentMain from "../assets/img/recruitment-main.png";
import recruitmentMap from "../assets/img/recruitment-map.png";
import LocationIcon from "../assets/svg/location.svg";

import { CompactCard } from "./compact-card";
import { InformationContainer } from "./information-container";
import { PersonnelContainer } from "./personnel-container";

const initialRecommendedMeetings = [
  {
    id: 1,
    title: "React 스터디 같이 하실 분 구해요",
    locationText: "강남구 · 스터디",
    liked: true,
  },
  {
    id: 2,
    title: "사이드 프로젝트 프론트엔드 팀원 모집",
    locationText: "서초구 · 프로젝트",
    liked: false,
  },
  {
    id: 3,
    title: "CS 면접 대비 스터디",
    locationText: "종로구 · 스터디",
    liked: false,
  },
  {
    id: 4,
    title: "AI 기반 서비스 개발 프로젝트",
    locationText: "성동구 · 프로젝트",
    liked: false,
  },
];

export default function RecruitmentPage() {
  const [recommendedMeetings, setRecommendedMeetings] = useState(initialRecommendedMeetings);

  const handleToggleLike = (id: number) => {
    setRecommendedMeetings((prev) =>
      prev.map((meeting) => (meeting.id === id ? { ...meeting, liked: !meeting.liked } : meeting)),
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <main className="mx-auto w-full max-w-[1312px] px-[24px] pt-[40px] pb-[120px]">
        <div className="flex flex-col gap-[56px]">
          <section className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
            <div className="relative aspect-[343/241] w-full overflow-hidden rounded-[32px] md:aspect-[333/332] xl:aspect-[630/443]">
              <Image
                src={recruitmentMain}
                alt="모임 대표 이미지"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 767px) 343px, (max-width: 1279px) 333px, 630px"
              />
            </div>

            <div className="flex w-full flex-col gap-[20px]">
              <InformationContainer showMoreButton />
              <PersonnelContainer />
            </div>
          </section>

          <section className="flex flex-col gap-[20px]">
            <h2 className="font-semibold text-2xl text-black leading-[1.4]">모임 설명</h2>

            <div className="rounded-[32px] bg-white px-[20px] py-[18px] font-normal text-gray-700 text-lg leading-[28px]">
              작은 독서 습관을 만들기 위해서 같이 열심히 해보실 사람을 구합니다~
              <br />
              궁금한 점 있으시면 https://open.kakao.com/abcdefg12345 참여해서 질문주세요~
            </div>
          </section>

          <section className="flex flex-col gap-[20px]">
            <h2 className="font-semibold text-2xl text-black leading-[1.4]">모임 장소</h2>

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
              <div className="relative aspect-[343/216] w-full overflow-hidden md:aspect-[696/352] xl:aspect-[1280/280]">
                <Image
                  src={recruitmentMap}
                  alt="모임 장소 지도"
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 343px, (max-width: 1279px) 696px, 1280px"
                />
              </div>

              <div className="flex flex-wrap items-center gap-[12px] px-[32px] py-[22px] font-medium text-black text-lg leading-[20px]">
                <span>서울특별시 중구 청계천로 100 시그니쳐타워 동관</span>

                <button
                  type="button"
                  className="flex items-center gap-[2px] text-green-600 transition-opacity hover:opacity-80"
                >
                  <Copy className="h-[16px] w-[16px]" />
                  <span>복사</span>
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5 pt-[240px]">
            <h2 className="font-semibold text-2xl text-black leading-[1.4]">이런 모임은 어때요?</h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(162px,1fr))] gap-x-4 gap-y-5">
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
                  onLikeClick={() => handleToggleLike(meeting.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
