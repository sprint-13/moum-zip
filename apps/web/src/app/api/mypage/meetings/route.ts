import { NextResponse } from "next/server";
import { getMyMeetings } from "@/_pages/mypage/queries/server";
import { isAuth } from "@/shared/api/server";

function isMeetingType(value: string | null): value is "joined" | "created" {
  return value === "joined" || value === "created";
}

function isMeetingSortBy(
  value: string | null,
): value is "dateTime" | "registrationEnd" | "joinedAt" | "participantCount" {
  return value === "dateTime" || value === "registrationEnd" || value === "joinedAt" || value === "participantCount";
}

function isSortOrder(value: string | null): value is "asc" | "desc" {
  return value === "asc" || value === "desc";
}

export async function GET(request: Request) {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!isMeetingType(type)) {
    return NextResponse.json({ message: "잘못된 모임 목록 타입입니다." }, { status: 400 });
  }

  try {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    // 탭/필터 변경 시에도 같은 외부 API를 재사용할 수 있도록 query를 그대로 전달합니다.
    const { data } = await getMyMeetings({
      type,
      completed:
        searchParams.get("completed") === "true"
          ? "true"
          : searchParams.get("completed") === "false"
            ? "false"
            : undefined,
      reviewed:
        searchParams.get("reviewed") === "true"
          ? "true"
          : searchParams.get("reviewed") === "false"
            ? "false"
            : undefined,
      sortBy: isMeetingSortBy(sortBy) ? sortBy : undefined,
      sortOrder: isSortOrder(sortOrder) ? sortOrder : undefined,
      size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
      cursor: searchParams.get("cursor") ?? undefined,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "모임 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}
