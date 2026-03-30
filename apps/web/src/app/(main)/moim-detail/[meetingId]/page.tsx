"use client";

import { LoadingIndicator } from "@ui/components";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import {
  deleteMeetingAction,
  favoriteMeetingAction,
  getCurrentUser,
  getSpaceSlugByMeetingAction,
  joinMeetingAction,
} from "@/_pages/moim-detail/actions";
import LocationIcon from "@/_pages/moim-detail/assets/svg/location.svg";
import {
  getIsJoined,
  mapMeetingDetailToDescription,
  mapMeetingDetailToInformationData,
  mapMeetingDetailToPersonnelBaseData,
  mapMeetingToRecommendedMeetingData,
  mapParticipantsToParticipantData,
} from "@/_pages/moim-detail/model/mapper";
import type { InformationData, PersonnelData, RecommendedMeetingData } from "@/_pages/moim-detail/model/types";
import { api } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MoimDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { meetingId } = use(params);
  const numericMeetingId = Number(meetingId);

  const [informationData, setInformationData] = useState<InformationData | null>(null);
  const [description, setDescription] = useState("");
  const [personnelData, setPersonnelData] = useState<PersonnelData | null>(null);
  const [recommendedMeetings, setRecommendedMeetings] = useState<RecommendedMeetingData[]>([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const [isJoinPending, setIsJoinPending] = useState(false);
  const [isEnterSpacePending, setIsEnterSpacePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [pendingRecommendedLikeIds, setPendingRecommendedLikeIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (Number.isNaN(numericMeetingId)) {
      setIsLoading(false);
      setErrorMessage("유효하지 않은 meetingId입니다.");
      return;
    }

    const fetchMeetingDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [currentUserResult, meetingDetailResponse, participantsResponse, meetingsResponse] = await Promise.all([
          getCurrentUser(),
          api.meetings.getDetail(numericMeetingId),
          api.meetings.participants.getList(numericMeetingId),
          api.meetings.getList(),
        ]);

        if (cancelled) {
          return;
        }

        const resolvedCurrentUserId = currentUserResult.ok ? currentUserResult.data.id : null;

        const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;
        const participantsList = "data" in participantsResponse ? participantsResponse.data : participantsResponse;
        const meetingsList = "data" in meetingsResponse ? meetingsResponse.data : meetingsResponse;

        if (!meetingDetail || !participantsList || !meetingsList) {
          throw new Error("API 응답이 예상된 형식이 아닙니다.");
        }

        const isJoined = getIsJoined(participantsList, resolvedCurrentUserId);

        const mappedInformationData = mapMeetingDetailToInformationData({
          meeting: meetingDetail,
          currentUserId: resolvedCurrentUserId,
          isJoined,
        });

        const mappedDescription = mapMeetingDetailToDescription(meetingDetail);
        const personnelBaseData = mapMeetingDetailToPersonnelBaseData(meetingDetail);
        const mappedParticipants = mapParticipantsToParticipantData(participantsList);

        setCurrentUserId(resolvedCurrentUserId);
        setInformationData(mappedInformationData);
        setDescription(mappedDescription);
        setPersonnelData({
          ...personnelBaseData,
          participants: mappedParticipants,
          extraCount: Math.max(meetingDetail.participantCount - mappedParticipants.length, 0),
        });
        setIsParticipating(isJoined);

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
            .map((meeting) => mapMeetingToRecommendedMeetingData(meeting)),
        );
      } catch (error) {
        if (!cancelled) {
          setErrorMessage("모임 정보를 불러오는데 실패했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchMeetingDetail();

    return () => {
      cancelled = true;
    };
  }, [numericMeetingId]);

  const handleToggleMeetingLike = async () => {
    if (!informationData || isFavoritePending) {
      return;
    }

    setIsFavoritePending(true);

    try {
      const result = await favoriteMeetingAction(informationData.id, informationData.isLiked);

      if (!result.ok) {
        alert(result.message);
        return;
      }

      setInformationData((prev) =>
        prev
          ? {
              ...prev,
              isLiked: result.data.isLiked,
            }
          : prev,
      );
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setIsFavoritePending(false);
    }
  };

  const handleParticipateToggle = async (_id: number, nextParticipating: boolean) => {
    if (!informationData || isJoinPending) {
      return;
    }

    const previousIsJoined = isParticipating;

    setIsJoinPending(true);
    setIsParticipating(nextParticipating);

    try {
      const result = await joinMeetingAction(informationData.id, previousIsJoined);

      if (!result.ok) {
        setIsParticipating(previousIsJoined);
        alert(result.message);
        return;
      }

      setIsParticipating(result.data.isJoined);
    } catch (error) {
      setIsParticipating(previousIsJoined);
      alert("참여 처리 중 오류가 발생했습니다.");
    } finally {
      setIsJoinPending(false);
    }
  };

  const handleShare = async (_id: number) => {
    try {
      const shareUrl = `${window.location.origin}/moim-detail/${numericMeetingId}`;

      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("모임 링크가 복사되었습니다.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("모임 링크가 복사되었습니다.");
    } catch (error) {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleEnterSpace = async (meetingId: number) => {
    if (isEnterSpacePending) {
      return;
    }

    setIsEnterSpacePending(true);

    try {
      const result = await getSpaceSlugByMeetingAction(meetingId);

      if (!result.ok) {
        alert(result.message);
        return;
      }

      router.push(`/${result.data.slug}`);
    } catch (error) {
      alert("스페이스 입장 중 오류가 발생했습니다.");
    } finally {
      setIsEnterSpacePending(false);
    }
  };

  const handleEdit = (_id: number) => {
    // TODO: 수정 페이지 연결 시 경로 교체
  };

  const handleDelete = async (_id: number) => {
    if (!informationData || isDeletePending) {
      return;
    }

    setIsDeletePending(true);

    try {
      const result = await deleteMeetingAction(informationData.id);

      if (!result.ok) {
        alert(result.message);
        return;
      }

      alert("모임이 삭제되었습니다.");
      router.replace(ROUTES.search);
    } catch (error) {
      alert("모임 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeletePending(false);
    }
  };

  const handleLoginAction = () => {
    router.push(`/login?redirect=%2Fmoim-detail%2F${numericMeetingId}`);
  };

  const handleMoveToMeetingDetail = (meetingId: number) => {
    router.push(`/moim-detail/${meetingId}`);
  };

  const handleToggleRecommendedLike = async (meetingId: number) => {
    if (pendingRecommendedLikeIds.includes(meetingId)) {
      return;
    }

    if (!currentUserId) {
      router.push(`/login?redirect=%2Fmoim-detail%2F${numericMeetingId}`);
      return;
    }

    const targetMeeting = recommendedMeetings.find((meeting) => meeting.id === meetingId);

    if (!targetMeeting) {
      return;
    }

    setPendingRecommendedLikeIds((prev) => [...prev, meetingId]);

    try {
      const result = await favoriteMeetingAction(targetMeeting.id, targetMeeting.isLiked);

      if (!result.ok) {
        alert(result.message);
        return;
      }

      setRecommendedMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id === meetingId
            ? {
                ...meeting,
                isLiked: result.data.isLiked,
              }
            : meeting,
        ),
      );
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setPendingRecommendedLikeIds((prev) => prev.filter((id) => id !== meetingId));
    }
  };

  if (Number.isNaN(numericMeetingId)) {
    return <div>유효하지 않은 meetingId입니다.</div>;
  }

  if (isLoading) {
    return <LoadingIndicator fullScreen text="모임 정보를 불러오는 중" />;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!informationData || !personnelData) {
    return <div>모임 정보를 표시할 수 없습니다.</div>;
  }

  const viewType = informationData.viewerRole === "manager" ? "manager" : "member";

  return (
    <div className="min-h-screen">
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
              viewType={viewType}
              isLoggedIn={!!currentUserId}
              isParticipating={isParticipating}
              onToggleLike={handleToggleMeetingLike}
              onParticipateToggle={handleParticipateToggle}
              onEnterSpace={handleEnterSpace}
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
            {recommendedMeetings.map((meeting) => {
              const isRecommendedLikePending = pendingRecommendedLikeIds.includes(meeting.id);

              return (
                <div
                  key={meeting.id}
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={(event) => {
                    const target = event.target as HTMLElement;

                    if (target.closest("button")) {
                      return;
                    }

                    handleMoveToMeetingDetail(meeting.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") {
                      return;
                    }

                    const target = event.target as HTMLElement;

                    if (target.closest("button")) {
                      return;
                    }

                    event.preventDefault();
                    handleMoveToMeetingDetail(meeting.id);
                  }}
                >
                  <CompactCard
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
                    onLikeClick={() => {
                      if (isRecommendedLikePending) {
                        return;
                      }

                      void handleToggleRecommendedLike(meeting.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
