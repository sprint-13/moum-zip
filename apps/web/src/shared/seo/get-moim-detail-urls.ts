import type { MeetingsListData } from "@moum-zip/api";
import { api } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";
import { RESOLVED_SITE_URL } from "@/shared/config/site";

const SITEMAP_PAGE_SIZE = 100;
const SITEMAP_MAX_PAGE_COUNT = 100;

const buildMoimDetailUrl = (meetingId: number) => {
  return new URL(`${ROUTES.moimDetail}/${meetingId}`, RESOLVED_SITE_URL).toString();
};

const getMeetingsPage = async (cursor?: string) => {
  const response = await api.meetings.getList({
    cursor,
    size: SITEMAP_PAGE_SIZE,
  });

  return response.data as MeetingsListData;
};
// sitemap 전용: meetings 목록 API를 cursor 끝까지 순회해 /moim-detail/{id} URL 배열을 만든다.
// 실패 시 sitemap 전체 생성이 깨지지 않도록 빈 배열을 반환한다.
export const getMoimDetailUrls = async (): Promise<string[]> => {
  try {
    const meetingDetailUrls = new Set<string>();
    const visitedCursors = new Set<string | null>();
    let cursor: string | undefined;
    let pageCount = 0;

    while (!visitedCursors.has(cursor ?? null)) {
      if (pageCount >= SITEMAP_MAX_PAGE_COUNT) {
        console.warn("getMoimDetailUrls reached max page count", { maxPages: SITEMAP_MAX_PAGE_COUNT });
        break;
      }

      visitedCursors.add(cursor ?? null);
      pageCount += 1;

      const page = await getMeetingsPage(cursor);

      for (const meeting of page.data) {
        meetingDetailUrls.add(buildMoimDetailUrl(meeting.id));
      }

      if (!page.hasMore || !page.nextCursor) {
        break;
      }

      cursor = page.nextCursor;
    }

    return [...meetingDetailUrls];
  } catch (error) {
    console.error("getMoimDetailUrls failed", error);
    return [];
  }
};
