import { RecommendedMeetingsClient } from "@/_pages/moim-detail/ui/recommended-meetings-client";
import { mapMeetingToRecommendedMeetingData, sortRecommendedMeetings } from "@/entities/moim-detail";
import { getApi } from "@/shared/api/server";

interface Props {
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

type ResponseWithArrayData = {
  data: unknown[];
  nextCursor?: unknown;
};

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

    if (!nextCursor) break;
    cursor = nextCursor;
  }

  return allMeetings;
};

export async function RecommendedMeetingsSection({ meetingId }: Props) {
  const apiClient = await getApi();

  try {
    const [meetingDetailResponse, allMeetings] = await Promise.all([
      apiClient.meetings.getDetail(meetingId),
      getAllMeetings(apiClient),
    ]);

    const meetingDetail = "data" in meetingDetailResponse ? meetingDetailResponse.data : meetingDetailResponse;

    if (!meetingDetail) {
      return null;
    }

    const sortableMeetingDetail: CurrentMeetingSortable = {
      id: meetingDetail.id,
      type: meetingDetail.type,
      region: meetingDetail.region,
      hostId: meetingDetail.hostId,
    };

    const recommendedMeetings = sortRecommendedMeetings(allMeetings, sortableMeetingDetail).map(
      mapMeetingToRecommendedMeetingData,
    );

    if (recommendedMeetings.length === 0) {
      return null;
    }

    return <RecommendedMeetingsClient meetings={recommendedMeetings} />;
  } catch {
    return null;
  }
}
