import { NextResponse } from "next/server";
import { memberQueries } from "@/entities/member";
import type { PostCategory } from "@/entities/post";
import { spaceQueries } from "@/entities/spaces";
import { createPostUseCase } from "@/features/space/use-cases/create-post";
import { getBulletinPostsUseCase } from "@/features/space/use-cases/get-bulletin-posts";
import { isAuth } from "@/shared/api/server";
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
    const space = await spaceQueries.findBySlug(slug);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const membership = await memberQueries.getMember(space.id, auth.userId);
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await getBulletinPostsUseCase(space.id, { page, category });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/spaces/[slug]/bulletin]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const space = await spaceQueries.findBySlug(slug);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const membership = await memberQueries.getMember(space.id, auth.userId);
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, content, category, image } = await request.json();
    const { postId } = await createPostUseCase({
      spaceId: space.id,
      authorId: auth.userId,
      title,
      content,
      category: category as PostCategory,
      image,
    });

    return NextResponse.json({ postId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/spaces/[slug]/bulletin]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
