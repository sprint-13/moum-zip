import { NextResponse } from "next/server";
import { memberQueries } from "@/entities/member";
import { spaceQueries } from "@/entities/spaces";
import { deleteCommentUseCase } from "@/features/space/use-cases/delete-comment";
import { updateCommentUseCase } from "@/features/space/use-cases/update-comment";
import { isAuth } from "@/shared/api/server";

async function getAuthAndSpace(slug: string) {
  const auth = await isAuth();
  if (!auth.authenticated || auth.userId == null) return { error: "Unauthorized" as const };

  const space = await spaceQueries.findBySlug(slug);
  if (!space) return { error: "NotFound" as const };

  const membership = await memberQueries.getMember(space.id, auth.userId);
  if (!membership) return { error: "Forbidden" as const };

  return { auth, space, membership };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; "post-id": string; "comment-id": string }> },
) {
  const { slug, "post-id": postId, "comment-id": commentId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { membership } = result;
  try {
    const { content } = await request.json();
    await updateCommentUseCase(commentId, content, { userId: membership.userId, role: membership.role });
    return NextResponse.json({});
  } catch (err) {
    console.error("[PATCH /api/.../comments/[comment-id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string; "post-id": string; "comment-id": string }> },
) {
  const { slug, "post-id": postId, "comment-id": commentId } = await params;
  const result = await getAuthAndSpace(slug);
  if ("error" in result) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "NotFound" ? 404 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  const { membership } = result;
  try {
    await deleteCommentUseCase(commentId, postId, { userId: membership.userId, role: membership.role });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/.../comments/[comment-id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
