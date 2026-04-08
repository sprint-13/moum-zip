import { updateTag } from "next/cache";
import { NextResponse } from "next/server";
import { memberQueries } from "@/entities/member";
import type { PostCategory } from "@/entities/post";
import { spaceQueries } from "@/entities/spaces";
import { deletePostUseCase } from "@/features/space/use-cases/delete-post";
import { getPostInfo } from "@/features/space/use-cases/get-post-detail";
import { updatePostUseCase } from "@/features/space/use-cases/update-post";
import { isAuth } from "@/shared/api/server";
import { CACHE_TAGS } from "@/shared/lib/cache";
import { AppError } from "@/shared/lib/error";

async function getAuthAndSpace(slug: string) {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) return { error: "Unauthorized" as const };

  const space = await spaceQueries.findBySlug(slug);
  if (!space) return { error: "NotFound" as const };

  const membership = await memberQueries.getMember(space.id, auth.userId);
  if (!membership) return { error: "Forbidden" as const };

  return { auth, space, membership };
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; "post-id": string }> }) {
  const { slug, "post-id": postId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  try {
    const post = await getPostInfo(postId, result.space.id);
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof AppError && err.code === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    console.error("[GET /api/.../bulletin/[post-id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string; "post-id": string }> }) {
  const { slug, "post-id": postId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { space, membership } = result;
  try {
    const { title, content, category } = await request.json();
    await updatePostUseCase(
      { postId, spaceId: space.id, title, content, category: category as PostCategory },
      { userId: membership.userId, role: membership.role },
    );
    updateTag(CACHE_TAGS.bulletin(space.id));
    return NextResponse.json({ postId });
  } catch (err) {
    if (err instanceof AppError && err.code === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    console.error("[PATCH /api/.../bulletin/[post-id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string; "post-id": string }> }) {
  const { slug, "post-id": postId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { space, membership } = result;
  try {
    await deletePostUseCase(postId, space.id, { userId: membership.userId, role: membership.role });
    updateTag(CACHE_TAGS.bulletin(space.id));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof AppError && err.code === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    console.error("[DELETE /api/.../bulletin/[post-id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
