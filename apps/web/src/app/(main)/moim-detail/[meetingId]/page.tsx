import { ChevronLeft } from "@moum-zip/ui/icons";
import { LoadingIndicator } from "@ui/components";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DescriptionSection, MoimDetailClient } from "@/_pages/moim-detail";
import { HeroImageSection } from "@/_pages/moim-detail/ui/hero-image-section";
import { RecommendedMeetingsSection } from "@/_pages/moim-detail/ui/recommended-meetings-section";
import {
  getIsJoined,
  mapMeetingDetailToDescription,
  mapMeetingDetailToInformationData,
  mapMeetingDetailToPersonnelBaseData,
  mapParticipantsToParticipantData,
} from "@/entities/moim-detail";
import { getCurrentUser } from "@/features/moim-detail/use-cases/get-current-user";
import { getApi, isAuth } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

interface MoimDetailContentProps {
  meetingId: number;
}

type CurrentUserData = {
  id: number | null;
  name: string | null;
  image: string | null;
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
    const [meetingDetailResult, participantsResult] = await Promise.allSettled([
      apiClient.meetings.getDetail(meetingId),
      apiClient.meetings.participants.getList(meetingId),
    ]);

    if (meetingDetailResult.status !== "fulfilled" || participantsResult.status !== "fulfilled") {
      return ERROR_FALLBACK;
    }

    const meetingDetailResponse = meetingDetailResult.value;
    const participantsResponse = participantsResult.value;

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

    return (
      <div className="min-h-screen">
        <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-20 sm:px-6">
          <div className="flex items-center py-2">
            <Link
              href={ROUTES.search}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="뒤로가기"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex flex-col gap-12">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
              <HeroImageSection image={meetingDetail.image ?? null} />

              <MoimDetailClient
                meetingId={meetingId}
                currentUser={currentUser}
                initialInformationData={informationData}
                initialPersonnelData={personnelData}
                initialIsParticipating={isJoined}
              />
            </section>

            <DescriptionSection
              description={description}
              hostName={informationData.hostName}
              hostImage={informationData.hostImage}
            />

            <Suspense fallback={null}>
              <RecommendedMeetingsSection meetingId={meetingId} />
            </Suspense>
          </div>
        </main>
      </div>
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
