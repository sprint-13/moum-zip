import { cacheLife, cacheTag } from "next/cache";
import { commentQueries, postQueries } from "@/entities/post/queries";
import { getTodayKST } from "@/entities/schedule";
import { attendanceQueries } from "@/entities/schedule/queries";
import { CACHE_TAGS } from "@/shared/lib/cache";

const DEFAULT_GRASS_DAYS = 84;
const RECENT_SCORE_DAYS = 7;

interface GrassRepository {
  countPostsByDateRange: (spaceId: string, userId: number, startAt: Date) => Promise<GrassCountByDateRow[]>;
  countCommentsByDateRange: (spaceId: string, userId: number, startAt: Date) => Promise<GrassCountByDateRow[]>;
  countAttendancesByDateRange: (spaceId: string, userId: number, startDate: string) => Promise<GrassCountByDateRow[]>;
}

interface GetGrassDeps {
  repository?: GrassRepository;
  getTodayDateKey?: () => string;
}

interface GrassCountByDateRow {
  date: string;
  count: number;
}

export interface GrassDay {
  date: string;
  score: number;
  intensity: number;
  postCount: number;
  commentCount: number;
  attendanceCount: number;
}

export interface GrassSummary {
  currentStreak: number;
  recentScore: number;
  activeDays: number;
}

export interface SpaceMemberGrass {
  days: GrassDay[];
  summary: GrassSummary;
}

export interface GetGrassOptions {
  days?: number;
}

const defaultGrassRepository: GrassRepository = {
  countPostsByDateRange: (spaceId, userId, startAt) => postQueries.countByAuthorDateRange(spaceId, userId, startAt),
  countCommentsByDateRange: (spaceId, userId, startAt) =>
    commentQueries.countByAuthorDateRange(spaceId, userId, startAt),
  countAttendancesByDateRange: (spaceId, userId, startDate) =>
    attendanceQueries.countByUserDateRange(spaceId, userId, startDate),
};

export const createGetGrassUseCase =
  ({ repository = defaultGrassRepository, getTodayDateKey = getTodayKST }: GetGrassDeps = {}) =>
  async (spaceId: string, userId: number, options: GetGrassOptions = {}): Promise<SpaceMemberGrass> => {
    const totalDays = normalizeWindowDays(options.days);
    const today = getTodayDateKey();
    const startDate = getDateKeyWithOffset(today, -(totalDays - 1));
    const startAt = parseDateKey(startDate);

    const [postCounts, commentCounts, attendanceCounts] = await Promise.all([
      repository.countPostsByDateRange(spaceId, userId, startAt),
      repository.countCommentsByDateRange(spaceId, userId, startAt),
      repository.countAttendancesByDateRange(spaceId, userId, startDate),
    ]);

    return buildGrass(totalDays, startDate, {
      postCounts,
      commentCounts,
      attendanceCounts,
    });
  };

const getGrass = createGetGrassUseCase();

export async function getGrassUseCase(
  spaceId: string,
  userId: number,
  options: GetGrassOptions = {},
): Promise<SpaceMemberGrass> {
  "use cache";
  cacheTag(CACHE_TAGS.grass(spaceId, userId));
  cacheLife("hours");

  return getGrass(spaceId, userId, options);
}

const buildGrass = (
  totalDays: number,
  startDate: string,
  counts: {
    postCounts: GrassCountByDateRow[];
    commentCounts: GrassCountByDateRow[];
    attendanceCounts: GrassCountByDateRow[];
  },
): SpaceMemberGrass => {
  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = getDateKeyWithOffset(startDate, index);

    return {
      date,
      score: 0,
      intensity: 0,
      postCount: 0,
      commentCount: 0,
      attendanceCount: 0,
    } satisfies GrassDay;
  });

  const dayMap = new Map(days.map((day) => [day.date, day]));

  applyCounts(dayMap, counts.postCounts, "postCount");
  applyCounts(dayMap, counts.commentCounts, "commentCount");
  applyCounts(dayMap, counts.attendanceCounts, "attendanceCount");

  const normalizedDays = days.map((day) => {
    const score = day.postCount * 2 + day.commentCount + day.attendanceCount;

    return {
      ...day,
      score,
      intensity: getGrassIntensity(score),
    };
  });

  return {
    days: normalizedDays,
    summary: {
      currentStreak: getCurrentStreak(normalizedDays),
      recentScore: getRecentScore(normalizedDays),
      activeDays: normalizedDays.filter((day) => day.score > 0).length,
    },
  };
};

const applyCounts = (
  dayMap: Map<string, GrassDay>,
  rows: GrassCountByDateRow[],
  key: "postCount" | "commentCount" | "attendanceCount",
) => {
  rows.forEach(({ date, count: dailyCount }) => {
    const day = dayMap.get(date);
    if (!day) {
      return;
    }

    day[key] = dailyCount;
  });
};

const getCurrentStreak = (days: GrassDay[]) => {
  let streak = 0;

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index]?.score === 0) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const getRecentScore = (days: GrassDay[]) => {
  return days.slice(-RECENT_SCORE_DAYS).reduce((sum, day) => sum + day.score, 0);
};

const getGrassIntensity = (score: number) => {
  if (score >= 7) {
    return 7;
  }

  if (score >= 5) {
    return 5;
  }

  if (score >= 3) {
    return 3;
  }

  if (score >= 2) {
    return 2;
  }

  if (score >= 1) {
    return 1;
  }

  return 0;
};

const normalizeWindowDays = (days?: number) => {
  if (!days || Number.isNaN(days)) {
    return DEFAULT_GRASS_DAYS;
  }

  return Math.max(1, Math.floor(days));
};

const getDateKeyWithOffset = (date: string, amount: number) => {
  const nextDate = parseDateKey(date);
  nextDate.setDate(nextDate.getDate() + amount);

  return formatDateKey(nextDate);
};

const parseDateKey = (date: string) => new Date(`${date}T00:00:00+09:00`);

const formatDateKey = (date: Date) => {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(date);
};
