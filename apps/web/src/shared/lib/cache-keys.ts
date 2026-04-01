import { unstable_cache } from "next/cache";
/**
 * unstable_cache의 두 번째 인자 (keyParts).
 * Next.js Data Cache에서 항목을 식별하는 기본 키.
 * 인자가 다르면 자동으로 다른 캐시 항목으로 저장된다.
 */
export const CACHE_KEYS = {
  spaceInfo: "space-info",
  spaceBySlug: "space-by-slug",
  spaceMembership: "space-membership",
  bulletinPosts: "bulletin-posts",
  postDetail: "post-detail",
  schedules: "schedules",
  spaceMembers: "space-members",
  spaceAllMembers: "space-all-members",
  spaceList: "space-list",
} as const;

/**
 * revalidateTag / unstable_cache tags 옵션에 사용하는 태그.
 * mutation 후 이 태그를 revalidateTag에 전달하면 관련 캐시가 무효화된다.
 *
 * @example
 * revalidateTag(CACHE_TAGS.bulletin(spaceId));
 */
export const CACHE_TAGS = {
  space: (slug: string) => `space-${slug}`,
  bulletin: (spaceId: string) => `bulletin-${spaceId}`,
  post: (postId: string) => `post-${postId}`,
  schedules: (spaceId: string) => `schedules-${spaceId}`,
  members: (spaceId: string) => `members-${spaceId}`,
  membership: (spaceId: string) => `membership-${spaceId}`,
  spaceList: (userId: string) => `space-list-${userId}`,
} as const;

/**
 * unstable_cache의 revalidate 옵션 기준값.
 * NEVER: 명시적 revalidateTag로만 무효화 (자주 변하지 않는 데이터).
 */
export const CACHE_TTL = {
  NEVER: false as const,
  SHORT: 30,
  MEDIUM: 60,
  LONG: 3600,
} as const;

/**
 * 동적 태그를 갖는 unstable_cache 인스턴스를 lazy하게 생성하는 팩토리.
 *
 * @example
 * const getBulletinPostsCached = createTaggedCache(
 *   fetchBulletinPosts,
 *   (spaceId) => ({ key: [CACHE_KEYS.bulletinPosts, spaceId], tags: [CACHE_TAGS.bulletin(spaceId)], revalidate: CACHE_TTL.SHORT }),
 * );
 * export const getBulletinPostsUseCase = (spaceId: string, opts: BulletinOpts) =>
 *   getBulletinPostsCached(spaceId)(spaceId, opts);
 */
type Callback = (...args: any[]) => Promise<unknown>;

export function createTaggedCache<T extends Callback>(
  fn: T,
  optsFn: (id: string) => { key: string[]; tags: string[]; revalidate: number | false },
): (id: string) => T {
  const cache = new Map<string, T>();
  return (id: string): T => {
    if (!cache.has(id)) {
      const { key, tags, revalidate } = optsFn(id);
      cache.set(id, unstable_cache(fn, key, { tags, revalidate }) as T);
    }
    return cache.get(id)!;
  };
}
