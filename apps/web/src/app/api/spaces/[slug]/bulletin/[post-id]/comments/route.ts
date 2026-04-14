import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { memberQueries } from "@/entities/member";
import { spaceQueries } from "@/entities/spaces";
import { createCommentUseCase } from "@/features/space/use-cases/create-comment";
import { getPostComments } from "@/features/space/use-cases/get-post-detail";
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
    const comments = await getPostComments(postId, result.space.id);
    return NextResponse.json(comments);
  } catch (err) {
    if (err instanceof AppError && err.code === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    console.error("[GET /api/.../comments]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string; "post-id": string }> }) {
  const { slug, "post-id": postId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { auth, space, membership } = result;
  if (typeof auth.userId !== "number") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    const authorId = auth.userId;
    const { commentId } = await createCommentUseCase({
      postId,
      spaceId: space.id,
      authorId: auth.userId as number,
      authorName: membership.nickname,
      content,
    });
    revalidateTag(CACHE_TAGS.grass(space.id, authorId), { expire: 0 });
    revalidatePath(`/${slug}`);
    return NextResponse.json({ commentId }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError && err.code === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    console.error("[POST /api/.../comments]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
