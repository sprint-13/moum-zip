import { and, asc, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/shared/db";
import { spaceMembers, spacePostComments, spacePostLikes, spacePosts } from "@/shared/db/scheme";
import type { PostCategory } from "./model/types";

// ─── 게시글 ────────────────────────────────────────────────────────────────────

const authorFields = {
  id: spaceMembers.userId,
  name: spaceMembers.nickname,
  image: spaceMembers.avatarUrl,
};

/** UTC timestamp를 KST 일자 문자열로 변환 */
const createKstDateExpr = (column: typeof spacePosts.createdAt | typeof spacePostComments.createdAt) =>
  sql<string>`to_char(timezone('Asia/Seoul', timezone('UTC', ${column})), 'YYYY-MM-DD')`;

export const postQueries = {
  /** 게시글 목록 (작성자 포함) */
  findManyBySpaceId: (spaceId: string, opts?: { category?: PostCategory; limit?: number; offset?: number }) =>
    db
      .select({ post: spacePosts, author: authorFields })
      .from(spacePosts)
      .innerJoin(
        spaceMembers,
        and(eq(spaceMembers.userId, spacePosts.authorId), eq(spaceMembers.spaceId, spacePosts.spaceId)),
      )
      .where(
        opts?.category
          ? and(eq(spacePosts.spaceId, spaceId), eq(spacePosts.category, opts.category))
          : eq(spacePosts.spaceId, spaceId),
      )
      .orderBy(desc(spacePosts.createdAt))
      .limit(opts?.limit ?? 10)
      .offset(opts?.offset ?? 0),

  /** 단건 조회 (작성자 포함) */
  findById: (postId: string) =>
    db
      .select({ post: spacePosts, author: authorFields })
      .from(spacePosts)
      .innerJoin(
        spaceMembers,
        and(eq(spaceMembers.userId, spacePosts.authorId), eq(spaceMembers.spaceId, spacePosts.spaceId)),
      )
      .where(eq(spacePosts.id, postId))
      .limit(1),

  /**
   * 게시글 목록 + 전체 카운트 (윈도우 함수 사용, 단일 쿼리).
   * COUNT(*) OVER()는 LIMIT 적용 전 전체 행 수를 반환한다.
   * getBulletinPosts에서 별도 COUNT 쿼리를 제거하기 위해 사용한다.
   */
  findManyWithTotalBySpaceId: (spaceId: string, opts?: { category?: PostCategory; limit?: number; offset?: number }) =>
    db
      .select({
        post: spacePosts,
        author: authorFields,
        total: sql<number>`COUNT(*) OVER()`.mapWith(Number),
      })
      .from(spacePosts)
      .innerJoin(
        spaceMembers,
        and(eq(spaceMembers.userId, spacePosts.authorId), eq(spaceMembers.spaceId, spacePosts.spaceId)),
      )
      .where(
        opts?.category
          ? and(eq(spacePosts.spaceId, spaceId), eq(spacePosts.category, opts.category))
          : eq(spacePosts.spaceId, spaceId),
      )
      .orderBy(desc(spacePosts.createdAt))
      .limit(opts?.limit ?? 10)
      .offset(opts?.offset ?? 0),

  /** 전체 게시글 수 */
  countBySpaceId: async (spaceId: string, category?: PostCategory) => {
    const result = await db
      .select({ count: count() })
      .from(spacePosts)
      .where(
        category
          ? and(eq(spacePosts.spaceId, spaceId), eq(spacePosts.category, category))
          : eq(spacePosts.spaceId, spaceId),
      );
    return result[0]?.count ?? 0;
  },

  /** 게시글 생성 */
  create: (input: {
    id: string;
    spaceId: string;
    authorId: number;
    category: PostCategory;
    title: string;
    content: string;
    image?: string;
  }) => db.insert(spacePosts).values(input).returning(),

  /** 게시글 삭제 */
  deleteById: (postId: string) => db.delete(spacePosts).where(eq(spacePosts.id, postId)).returning(),

  /** 게시글 수정 */
  updateById: (postId: string, fields: { title: string; content: string; category: PostCategory }) =>
    db
      .update(spacePosts)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(spacePosts.id, postId))
      .returning(),

  /** 오늘 작성된 게시글 수 */
  countTodayBySpaceId: async (spaceId: string) => {
    const todayStart = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    todayStart.setHours(0, 0, 0, 0);
    const result = await db
      .select({ count: count() })
      .from(spacePosts)
      .where(and(eq(spacePosts.spaceId, spaceId), gte(spacePosts.createdAt, todayStart)));
    return result[0]?.count ?? 0;
  },

  /** 작성자 기준 최근 활동 일자별 게시글 수 집계 */
  countByAuthorDateRange: async (
    spaceId: string,
    authorId: number,
    startAt: Date,
  ): Promise<Array<{ date: string; count: number }>> => {
    const dateExpr = createKstDateExpr(spacePosts.createdAt);

    return db
      .select({
        date: dateExpr,
        count: count().mapWith(Number),
      })
      .from(spacePosts)
      .where(
        and(eq(spacePosts.spaceId, spaceId), eq(spacePosts.authorId, authorId), gte(spacePosts.createdAt, startAt)),
      )
      .groupBy(dateExpr)
      .orderBy(dateExpr);
  },

  /** 인기 게시글 (viewCount + likeCount*2 + commentCount*1.4 점수 내림차순) */
  findPopularBySpaceId: async (spaceId: string, limit = 3) => {
    return db
      .select()
      .from(spacePosts)
      .where(eq(spacePosts.spaceId, spaceId))
      .orderBy(desc(sql`${spacePosts.viewCount} + ${spacePosts.likeCount} * 2 + ${spacePosts.commentCount} * 1.4`))
      .limit(limit);
  },

  /** 조회수 증가 */
  incrementViewCount: (postId: string) =>
    db
      .update(spacePosts)
      .set({ viewCount: sql`${spacePosts.viewCount} + 1` })
      .where(eq(spacePosts.id, postId)),
};

// ─── 댓글 ─────────────────────────────────────────────────────────────────────

export const commentQueries = {
  /** 게시글 댓글 목록 (작성자 포함) */
  findManyByPostId: (postId: string, spaceId: string) =>
    db
      .select({ comment: spacePostComments, author: authorFields })
      .from(spacePostComments)
      .innerJoin(
        spaceMembers,
        and(eq(spaceMembers.userId, spacePostComments.authorId), eq(spaceMembers.spaceId, spacePostComments.spaceId)),
      )
      .where(and(eq(spacePostComments.postId, postId), eq(spacePostComments.spaceId, spaceId)))
      .orderBy(asc(spacePostComments.createdAt)),

  /** 댓글 단건 조회 */
  findById: (commentId: string) =>
    db
      .select()
      .from(spacePostComments)
      .where(eq(spacePostComments.id, commentId))
      .limit(1)
      .then((rows) => rows[0]),

  /** 댓글 수정 */
  updateById: (commentId: string, content: string) =>
    db
      .update(spacePostComments)
      .set({ content, updatedAt: new Date() })
      .where(eq(spacePostComments.id, commentId))
      .returning()
      .then((rows) => rows[0]),

  /** 작성자 기준 최근 활동 일자별 댓글 수 집계 */
  countByAuthorDateRange: async (
    spaceId: string,
    authorId: number,
    startAt: Date,
  ): Promise<Array<{ date: string; count: number }>> => {
    const dateExpr = createKstDateExpr(spacePostComments.createdAt);

    return db
      .select({
        date: dateExpr,
        count: count().mapWith(Number),
      })
      .from(spacePostComments)
      .where(
        and(
          eq(spacePostComments.spaceId, spaceId),
          eq(spacePostComments.authorId, authorId),
          gte(spacePostComments.createdAt, startAt),
        ),
      )
      .groupBy(dateExpr)
      .orderBy(dateExpr);
  },

  /** 댓글 생성 + 게시글 commentCount 증가 (트랜잭션) */
  create: async (input: { id: string; postId: string; spaceId: string; authorId: number; content: string }) => {
    return db.transaction(async (tx) => {
      const [comment] = await tx.insert(spacePostComments).values(input).returning();
      await tx
        .update(spacePosts)
        .set({ commentCount: sql`${spacePosts.commentCount} + 1` })
        .where(eq(spacePosts.id, input.postId));
      return comment;
    });
  },

  /** 댓글 삭제 + 게시글 commentCount 감소 (트랜잭션) */
  deleteById: async (commentId: string, postId: string) => {
    return db.transaction(async (tx) => {
      const [comment] = await tx.delete(spacePostComments).where(eq(spacePostComments.id, commentId)).returning();
      if (comment) {
        await tx
          .update(spacePosts)
          .set({ commentCount: sql`GREATEST(${spacePosts.commentCount} - 1, 0)` })
          .where(eq(spacePosts.id, postId));
      }
      return comment;
    });
  },
};

// ─── 좋아요 ────────────────────────────────────────────────────────────────────

export const likeQueries = {
  /** 좋아요 여부 확인 */
  findByPostAndUser: (postId: string, userId: number) =>
    db
      .select()
      .from(spacePostLikes)
      .where(and(eq(spacePostLikes.postId, postId), eq(spacePostLikes.userId, userId)))
      .limit(1),

  /** 좋아요 추가 + likeCount 증가 (트랜잭션) */
  create: async (input: { id: string; postId: string; userId: number }) => {
    return db.transaction(async (tx) => {
      const [like] = await tx.insert(spacePostLikes).values(input).returning();
      await tx
        .update(spacePosts)
        .set({ likeCount: sql`${spacePosts.likeCount} + 1` })
        .where(eq(spacePosts.id, input.postId));
      return like;
    });
  },

  /** 좋아요 취소 + likeCount 감소 (트랜잭션) */
  deleteByPostAndUser: async (postId: string, userId: number) => {
    return db.transaction(async (tx) => {
      const [like] = await tx
        .delete(spacePostLikes)
        .where(and(eq(spacePostLikes.postId, postId), eq(spacePostLikes.userId, userId)))
        .returning();
      if (like) {
        await tx
          .update(spacePosts)
          .set({ likeCount: sql`GREATEST(${spacePosts.likeCount} - 1, 0)` })
          .where(eq(spacePosts.id, postId));
      }
      return like;
    });
  },
};
