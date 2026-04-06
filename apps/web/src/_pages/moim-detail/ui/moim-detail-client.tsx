"use client";

import { toast } from "@ui/components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import { deleteMeetingAction, favoriteMeetingAction, joinMeetingAction } from "@/_pages/moim-detail/actions";
import LocationIcon from "@/_pages/moim-detail/assets/location.svg";
import type { InformationData, ParticipantData, PersonnelData, RecommendedMeetingData } from "@/entities/moim-detail";
import { ROUTES } from "@/shared/config/routes";

interface CurrentUser {
  id: number | null;
  name: string | null;
  image: string | null;
}

interface MoimDetailClientProps {
  meetingId: number;
  currentUser: CurrentUser;
  initialInformationData: InformationData;
  initialDescription: string;
  initialPersonnelData: PersonnelData;
  initialRecommendedMeetings: RecommendedMeetingData[];
  initialIsParticipating: boolean;
}

export function MoimDetailClient({
  meetingId,
  currentUser,
  initialInformationData,
  initialDescription,
  initialPersonnelData,
  initialRecommendedMeetings,
  initialIsParticipating,
}: MoimDetailClientProps) {
  const router = useRouter();

  const [informationData, setInformationData] = useState<InformationData>(initialInformationData);
  const [personnelData, setPersonnelData] = useState<PersonnelData>(initialPersonnelData);
  const [recommendedMeetings, setRecommendedMeetings] = useState<RecommendedMeetingData[]>(initialRecommendedMeetings);
  const [isParticipating, setIsParticipating] = useState(initialIsParticipating);

  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const [isJoinPending, setIsJoinPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [pendingRecommendedLikeIds, setPendingRecommendedLikeIds] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleToggleMeetingLike = async (): Promise<boolean> => {
    if (isFavoritePending) {
      return false;
    }

    if (!currentUser.id) {
      router.push(`/login?redirect=%2Fmoim-detail%2F${meetingId}`);
      return false;
    }

    setIsFavoritePending(true);

    try {
      const result = await favoriteMeetingAction(informationData.id, informationData.isLiked);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return false;
      }

      setInformationData((prev) => ({
        ...prev,
        isLiked: result.data.isLiked,
      }));

      return true;
    } catch {
      toast({ message: "좋아요 처리 중 오류가 발생했습니다.", size: "small" });
      return false;
    } finally {
      setIsFavoritePending(false);
    }
  };

  const handleParticipateToggle = async (_id: number, nextParticipating: boolean) => {
    if (isJoinPending) {
      return;
    }

    const previousIsJoined = isParticipating;
    const previousPersonnelData = personnelData;

    setIsJoinPending(true);

    // 낙관적 업데이트
    setIsParticipating(nextParticipating);
    setPersonnelData((prev) => {
      const nextCurrentParticipants = nextParticipating
        ? prev.currentParticipants + 1
        : Math.max(prev.currentParticipants - 1, 0);

      let nextParticipants = prev.participants;

      if (currentUser.id) {
        if (nextParticipating) {
          const optimisticParticipant: ParticipantData = {
            id: currentUser.id,
            name: currentUser.name ?? "나",
            image: currentUser.image ?? null,
          };

          nextParticipants = [
            optimisticParticipant,
            ...prev.participants.filter((participant) => participant.id !== currentUser.id),
          ];
        } else {
          nextParticipants = prev.participants.filter((participant) => participant.id !== currentUser.id);
        }
      }

      return {
        ...prev,
        currentParticipants: nextCurrentParticipants,
        participants: nextParticipants,
        extraCount: Math.max(nextCurrentParticipants - nextParticipants.length, 0),
      };
    });

    try {
      const result = await joinMeetingAction(informationData.id, previousIsJoined);

      if (!result.ok) {
        setIsParticipating(previousIsJoined);
        setPersonnelData(previousPersonnelData);
        toast({ message: result.message, size: "small" });
        return;
      }

      setIsParticipating(result.data.isJoined);
    } catch {
      setIsParticipating(previousIsJoined);
      setPersonnelData(previousPersonnelData);
      toast({ message: "참여 처리 중 오류가 발생했습니다.", size: "small" });
    } finally {
      setIsJoinPending(false);
    }
  };

  const handleShare = async (_id: number) => {
    try {
      const shareUrl = `${window.location.origin}/moim-detail/${meetingId}`;

      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        toast({
          id: "share-link",
          message: "모임 링크가 복사되었습니다.",
          size: "small",
          duration: 2000,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      toast({
        id: "share-link",
        message: "모임 링크가 복사되었습니다.",
        size: "small",
        duration: 2000,
      });
    } catch {
      toast({
        id: "share-link-error",
        message: "링크 복사에 실패했습니다.",
        size: "small",
        duration: 2000,
      });
    }
  };

  const handleEdit = (targetMeetingId: number) => {
    router.push(`${ROUTES.moimEdit}/${targetMeetingId}`);
  };

  const handleDelete = async (_id: number) => {
    if (isDeletePending) {
      return;
    }

    setIsDeletePending(true);

    try {
      const result = await deleteMeetingAction(informationData.id);

      if (!result.ok) {
        toast({ message: result.message });
        return;
      }

      toast({ message: "모임이 삭제되었습니다.", size: "small" });
      router.replace(ROUTES.search);
    } catch {
      toast({ message: "모임 삭제 중 오류가 발생했습니다.", size: "small" });
    } finally {
      setIsDeletePending(false);
    }
  };

  const handleLoginAction = () => {
    router.push(`/login?redirect=%2Fmoim-detail%2F${meetingId}`);
  };

  const handleMoveToMeetingDetail = (targetMeetingId: number) => {
    router.push(`${ROUTES.moimDetail}/${targetMeetingId}`);
  };

  const handleToggleRecommendedLike = async (targetMeetingId: number): Promise<boolean> => {
    if (pendingRecommendedLikeIds.includes(targetMeetingId)) {
      return false;
    }

    if (!currentUser.id) {
      router.push(`/login?redirect=%2Fmoim-detail%2F${meetingId}`);
      return false;
    }

    const targetMeeting = recommendedMeetings.find((meeting) => meeting.id === targetMeetingId);

    if (!targetMeeting) {
      return false;
    }

    setPendingRecommendedLikeIds((prev) => [...prev, targetMeetingId]);

    try {
      const result = await favoriteMeetingAction(targetMeeting.id, targetMeeting.isLiked);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return false;
      }

      setRecommendedMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id === targetMeetingId
            ? {
                ...meeting,
                isLiked: result.data.isLiked,
              }
            : meeting,
        ),
      );

      return true;
    } catch {
      toast({ message: "좋아요 처리 중 오류가 발생했습니다.", size: "small" });
      return false;
    } finally {
      setPendingRecommendedLikeIds((prev) => prev.filter((id) => id !== targetMeetingId));
    }
  };

  const viewType = informationData.viewerRole === "manager" ? "manager" : "member";

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-[1312px] flex-col gap-[78px] px-4 pt-6 pb-24 md:px-6 md:pt-10 xl:px-12">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch">
          <div className="relative mx-auto aspect-[630/443] w-full max-w-[630px] overflow-hidden rounded-[20px] md:rounded-[32px]">
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
              isLoggedIn={!!currentUser.id}
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

        <DescriptionSection description={initialDescription} />

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
                        return false;
                      }

                      return handleToggleRecommendedLike(meeting.id);
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
