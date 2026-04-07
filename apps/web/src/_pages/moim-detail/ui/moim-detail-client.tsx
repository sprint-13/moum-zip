"use client";

import { toast } from "@ui/components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompactCard, DescriptionSection, InformationContainer, PersonnelContainer } from "@/_pages/moim-detail";
import { deleteMeetingAction, favoriteMeetingAction, joinMeetingAction } from "@/_pages/moim-detail/actions";
import LocationIcon from "@/_pages/moim-detail/assets/location.svg";
import { copyToClipboard } from "@/_pages/moim-detail/lib/copy-to-clipboard";
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

export const MoimDetailClient = ({
  meetingId,
  currentUser,
  initialInformationData,
  initialDescription,
  initialPersonnelData,
  initialRecommendedMeetings,
  initialIsParticipating,
}: MoimDetailClientProps) => {
  const router = useRouter();
  const loginRedirectPath = `/login?redirect=%2Fmoim-detail%2F${meetingId}`;

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

  useEffect(() => {
    setInformationData(initialInformationData);
    setPersonnelData(initialPersonnelData);
    setRecommendedMeetings(initialRecommendedMeetings);
    setIsParticipating(initialIsParticipating);
  }, [initialInformationData, initialPersonnelData, initialRecommendedMeetings, initialIsParticipating]);

  const handleToggleMeetingLike = async (): Promise<boolean> => {
    if (isFavoritePending) {
      return false;
    }

    if (!currentUser.id) {
      router.push(loginRedirectPath);
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

  const handleParticipateToggle = async (targetMeetingId: number, nextParticipating: boolean) => {
    if (isJoinPending) {
      return;
    }

    const previousIsJoined = isParticipating;
    const previousPersonnelData = personnelData;
    const previousInformationData = informationData;

    setIsJoinPending(true);
    setIsParticipating(nextParticipating);

    setInformationData((prev) => ({
      ...prev,
      isJoined: nextParticipating,
      actionState: {
        ...prev.actionState,
        canJoin: !nextParticipating,
        canCancelJoin: nextParticipating,
      },
    }));

    setPersonnelData((prev) => {
      const nextCurrentParticipants = nextParticipating
        ? prev.currentParticipants + 1
        : Math.max(prev.currentParticipants - 1, 0);

      if (!currentUser.id) {
        return {
          ...prev,
          currentParticipants: nextCurrentParticipants,
          extraCount: Math.max(nextCurrentParticipants - prev.participants.length, 0),
        };
      }

      const optimisticParticipant: ParticipantData = {
        id: currentUser.id,
        name: currentUser.name ?? "나",
        image: currentUser.image ?? null,
      };

      const nextParticipants = nextParticipating
        ? [...prev.participants.filter((participant) => participant.id !== currentUser.id), optimisticParticipant]
        : prev.participants.filter((participant) => participant.id !== currentUser.id);

      return {
        ...prev,
        currentParticipants: nextCurrentParticipants,
        participants: nextParticipants,
        extraCount: Math.max(nextCurrentParticipants - nextParticipants.length, 0),
      };
    });

    try {
      const result = await joinMeetingAction(targetMeetingId, previousIsJoined);

      if (!result.ok) {
        setIsParticipating(previousIsJoined);
        setInformationData(previousInformationData);
        setPersonnelData(previousPersonnelData);
        toast({ message: result.message, size: "small" });
        return;
      }

      router.refresh();
    } catch {
      setIsParticipating(previousIsJoined);
      setInformationData(previousInformationData);
      setPersonnelData(previousPersonnelData);
      toast({ message: "참여 처리 중 오류가 발생했습니다.", size: "small" });
    } finally {
      setIsJoinPending(false);
    }
  };

  const handleShare = async (targetMeetingId: number) => {
    const shareUrl = `${window.location.origin}/moim-detail/${targetMeetingId}`;

    const success = await copyToClipboard(shareUrl);

    toast({
      id: success ? "share-link" : "share-link-error",
      message: success ? "모임 링크가 복사되었습니다." : "링크 복사에 실패했습니다.",
      size: "small",
      duration: 2000,
    });
  };

  const handleEdit = (targetMeetingId: number) => {
    router.push(`${ROUTES.moimEdit}/${targetMeetingId}`);
  };

  const handleDelete = async (targetMeetingId: number) => {
    if (isDeletePending) {
      return;
    }

    setIsDeletePending(true);

    try {
      const result = await deleteMeetingAction(targetMeetingId);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
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

  const handleToggleRecommendedLike = async (targetMeetingId: number): Promise<boolean> => {
    if (pendingRecommendedLikeIds.includes(targetMeetingId)) {
      return false;
    }

    if (!currentUser.id) {
      router.push(loginRedirectPath);
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-6 pb-20 sm:px-6 lg:pt-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
          <div className="relative aspect-[630/400] h-full w-full overflow-hidden rounded-[16px] md:rounded-[20px]">
            {informationData.image ? (
              <Image src={informationData.image} alt="모임 대표 이미지" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                이미지 영역
              </div>
            )}
          </div>

          <div className="flex h-full w-full flex-col gap-4">
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

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-black text-xl leading-[1.4]">이런 모임은 어때요?</h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-4">
            {recommendedMeetings.map((meeting) => {
              const isRecommendedLikePending = pendingRecommendedLikeIds.includes(meeting.id);

              return (
                <Link
                  key={meeting.id}
                  href={`${ROUTES.moimDetail}/${meeting.id}`}
                  className="block cursor-pointer"
                  onClick={(event) => {
                    const target = event.target as HTMLElement;

                    if (target.closest("button")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <CompactCard
                    image={
                      meeting.image ? (
                        <Image src={meeting.image} alt={meeting.title} fill className="object-cover" />
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
                    onLike={() => {
                      if (isRecommendedLikePending) {
                        return false;
                      }

                      return handleToggleRecommendedLike(meeting.id);
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
