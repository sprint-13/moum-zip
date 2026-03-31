import { NextResponse } from "next/server";
import { getSpaceMembersUseCase } from "@/_pages/members/use-cases/get-space-members";
import { isAuth } from "@/shared/api/server";
import { getSpaceBySlugQuery, getSpaceMembershipQuery } from "@/shared/db/queries";
import { parsePaginationParams } from "@/shared/lib/pagination";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const rawParams = Object.fromEntries(searchParams.entries());
  const { page } = parsePaginationParams(rawParams);

  try {
    const space = await getSpaceBySlugQuery(slug);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const membership = await getSpaceMembershipQuery(space.id, auth.userId);
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await getSpaceMembersUseCase(space.id, { page });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
