/**
 * 여러 기능에서 공통으로 쓰이는 DB 쿼리 모음.
 *
 * 규칙:
 * - layout.tsx / page.tsx 양쪽에서 호출되는 쿼리는 cache()를 적용한다.
 * - 특정 기능 전용 쿼리는 entities/[domain]/queries.ts 에 작성한다.
 */

import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from ".";
import { attendances, spaceMembers, spacePosts, spaces } from "./scheme";

// ─── Space ────────────────────────────────────────────────────────────────────

/**
 * slug로 Space 조회.
 * - unstable_cache: 요청 간 캐싱 (revalidate: 60s, tag: space-{slug})
 * - React cache(): 같은 요청 내 중복 쿼리 방지
 */
export const getSpaceBySlugQuery = cache((slug: string) =>
  unstable_cache(() => db.query.spaces.findFirst({ where: eq(spaces.slug, slug) }), ["space-by-slug", slug], {
    tags: [`space-${slug}`],
    revalidate: false,
  })(),
);

// ─── SpaceMember ──────────────────────────────────────────────────────────────

/**
 * 특정 유저의 스페이스 멤버십 조회 (role, nickname 포함).
 * - unstable_cache: 요청 간 캐싱 (revalidate: 60s, tag: membership-{spaceId})
 * - React cache(): 같은 요청 내 중복 쿼리 방지
 *
 * 멤버십 변경(가입/탈퇴/role 변경) 시 revalidateTag(`membership-${spaceId}`)로 무효화.
 */
export const getSpaceMembershipQuery = cache((spaceId: string, userId: number) =>
  unstable_cache(
    () =>
      db.query.spaceMembers.findFirst({
        where: and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)),
      }),
    ["space-membership", spaceId, String(userId)],
    { tags: [`membership-${spaceId}`], revalidate: false },
  )(),
);

/** 스페이스 전체 멤버 목록 조회. */
export const getSpaceMembersQuery = (spaceId: string) =>
  db.query.spaceMembers.findMany({
    where: eq(spaceMembers.spaceId, spaceId),
  });

// ─── SpacePost ────────────────────────────────────────────────────────────────

/**
 * 스페이스에 등록된 postId 목록 조회 (최신순).
 * 실제 게시글 데이터는 postId 목록으로 외부 API를 호출해 가져온다.
 */
export const getSpacePostIdsQuery = (spaceId: string) =>
  db.query.spacePosts.findMany({
    where: eq(spacePosts.spaceId, spaceId),
    orderBy: [desc(spacePosts.createdAt)],
  });

// ─── Attendance ───────────────────────────────────────────────────────────────

/** 오늘 출석 여부 확인. */
export const getTodayAttendanceQuery = (spaceId: string, userId: number) => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  return db.query.attendances.findFirst({
    where: and(eq(attendances.spaceId, spaceId), eq(attendances.userId, userId), eq(attendances.date, today)),
  });
};

/** 특정 날짜의 스페이스 출석자 전체 조회. */
export const getSpaceAttendanceByDateQuery = (spaceId: string, date: string) =>
  db.query.attendances.findMany({
    where: and(eq(attendances.spaceId, spaceId), eq(attendances.date, date)),
  });
