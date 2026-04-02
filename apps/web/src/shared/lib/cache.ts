export const CACHE_TAGS = {
  space: (slug: string) => `space-${slug}`,
  members: (spaceId: string) => `members-${spaceId}`,
  member: (spaceId: string, userId: number) => `member-${spaceId}-${userId}`,
  bulletin: (spaceId: string) => `bulletin-${spaceId}`,
  post: (postId: string) => `post-${postId}`,
  schedule: (spaceId: string) => `schedule-${spaceId}`,
  attendance: (spaceId: string) => `attendance-${spaceId}`,
} as const;
