import { getSpaceBySlugQuery, getSpaceMembershipQuery } from "@/shared/db/queries";
import { getSession } from "../../../shared/lib/get-session";

/**
 * Route Handler 전용 접근 검증.
 *
 * layout.tsx의 getSpaceContext와 달리 redirect/notFound를 던지지 않고
 * null을 반환한다. Route Handler는 HTTP 응답으로 직접 처리해야 하기 때문.
 *
 * 사용 예:
 *   const access = await verifySpaceAccess(slug);
 *   if (!access) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 */
export async function verifySpaceAccess(slug: string) {
  const session = await getSession();
  if (!session) return null;

  const space = await getSpaceBySlugQuery(slug);
  if (!space) return null;

  const membership = await getSpaceMembershipQuery(space.id, session.userId);
  if (!membership) return null;

  return { space, membership, session };
}
