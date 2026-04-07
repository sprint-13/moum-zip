export const CACHE_TAGS = {
  space: (slug: string) => `space-${slug}`,
  members: (spaceId: string) => `members-${spaceId}`,
  member: (spaceId: string, userId: number) => `member-${spaceId}-${userId}`,
  bulletin: (spaceId: string) => `bulletin-${spaceId}`,
  schedule: (spaceId: string) => `schedule-${spaceId}`,
  attendance: (spaceId: string, userId?: number) =>
    userId ? `attendance-${spaceId}-${userId}` : `attendance-${spaceId}`,
} as const;
