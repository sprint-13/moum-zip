import { NextResponse } from "next/server";
import { getApi, isAuth } from "@/shared/api/server";

function isFavoriteSortBy(
  value: string | null,
): value is "createdAt" | "dateTime" | "registrationEnd" | "participantCount" {
  return value === "createdAt" || value === "dateTime" || value === "registrationEnd" || value === "participantCount";
}

function isSortOrder(value: string | null): value is "asc" | "desc" {
  return value === "asc" || value === "desc";
}

export async function GET(request: Request) {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const authedApi = await getApi();
    const { data } = await authedApi.favorites.getList({
      type: searchParams.get("type") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      sortBy: isFavoriteSortBy(sortBy) ? sortBy : undefined,
      sortOrder: isSortOrder(sortOrder) ? sortOrder : undefined,
      size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
      cursor: searchParams.get("cursor") ?? undefined,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "찜 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { meetingId } = (await request.json()) as { meetingId?: number };

    if (typeof meetingId !== "number") {
      return NextResponse.json({ message: "잘못된 모임 정보입니다." }, { status: 400 });
    }

    const authedApi = await getApi();
    const { data } = await authedApi.favorites.create(meetingId);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ message: "찜 추가에 실패했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { meetingId } = (await request.json()) as { meetingId?: number };

    if (typeof meetingId !== "number") {
      return NextResponse.json({ message: "잘못된 모임 정보입니다." }, { status: 400 });
    }

    const authedApi = await getApi();
    await authedApi.favorites.delete(meetingId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "찜 해제에 실패했습니다." }, { status: 500 });
  }
}
