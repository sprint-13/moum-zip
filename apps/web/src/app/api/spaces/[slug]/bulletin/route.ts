import { NextResponse } from "next/server";
import type { PostCategory } from "@/entities/post";
import { getBulletinPostsUseCase } from "@/features/space/use-cases/get-bulletin-posts";
import { isAuth } from "@/shared/api/server";
import { getSpaceBySlugQuery, getSpaceMembershipQuery } from "@/shared/db/queries";
import { parsePaginationParams } from "@/shared/lib/pagination";

const POST_CATEGORIES = ["notice", "discussion", "question", "material"] as const satisfies readonly PostCategory[];

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const rawParams = Object.fromEntries(searchParams.entries());
  const { page, filter: category } = parsePaginationParams(rawParams, {
    filterKey: "category",
    validFilters: POST_CATEGORIES,
  });

  try {
    const space = await getSpaceBySlugQuery(slug);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const membership = await getSpaceMembershipQuery(space.id, auth.userId);
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await getBulletinPostsUseCase(space.id, { page, category });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
