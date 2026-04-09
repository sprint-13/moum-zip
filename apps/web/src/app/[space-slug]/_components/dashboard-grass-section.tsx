import { SpaceCard } from "@/features/space";
import { getGrassUseCase } from "@/features/space/use-cases/get-member-grass";
import { cn } from "@/shared/lib/cn";

interface DashboardGrassSectionProps {
  spaceId: string;
  userId: number;
}

const WEEK_COLUMN_SIZE = 7;

export const DashboardGrassSection = async ({ spaceId, userId }: DashboardGrassSectionProps) => {
  const grass = await getGrassUseCase(spaceId, userId);
  const weekColumns = chunkWeekColumns(grass.days);

  return (
    <SpaceCard>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-bold text-base">활동 잔디</h3>
          <p className="text-muted-foreground text-sm">최근 12주 동안의 스페이스 활동이에요.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-muted-foreground text-xs">연속 활동일</p>
            <p className="font-semibold text-base">{grass.summary.currentStreak}일</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-muted-foreground text-xs">최근 7일 점수</p>
            <p className="font-semibold text-base">{grass.summary.recentScore}점</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-fit gap-1.5">
            {weekColumns.map((week) => (
              <div key={week[0]?.date ?? "empty-week"} className="grid grid-rows-7 gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    role="img"
                    title={formatDayLabel(day)}
                    aria-label={formatDayLabel(day)}
                    className={cn(
                      "h-3.5 w-3.5 rounded-[4px] border transition-colors",
                      getGrassCellClassName(day.intensity),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>활동일 {grass.summary.activeDays}일</span>
          <div className="flex items-center gap-1.5">
            <span>적음</span>
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div key={intensity} className={cn("h-3 w-3 rounded-[3px] border", getGrassCellClassName(intensity))} />
            ))}
            <span>많음</span>
          </div>
        </div>
      </div>
    </SpaceCard>
  );
};

const chunkWeekColumns = <T,>(items: T[]) => {
  return Array.from({ length: Math.ceil(items.length / WEEK_COLUMN_SIZE) }, (_, index) =>
    items.slice(index * WEEK_COLUMN_SIZE, (index + 1) * WEEK_COLUMN_SIZE),
  );
};

const getGrassCellClassName = (intensity: number) => {
  switch (intensity) {
    case 4:
      return "border-primary bg-primary";
    case 3:
      return "border-primary/70 bg-primary/70";
    case 2:
      return "border-primary/45 bg-primary/45";
    case 1:
      return "border-primary/20 bg-primary/20";
    default:
      return "border-border/60 bg-muted/60";
  }
};

const formatDayLabel = (day: {
  date: string;
  score: number;
  postCount: number;
  commentCount: number;
  attendanceCount: number;
}) => {
  const attendanceLabel = day.attendanceCount > 0 ? "출석함" : "출석 없음";

  return `${day.date} · ${day.score}점 · 게시글 ${day.postCount}개 · 댓글 ${day.commentCount}개 · ${attendanceLabel}`;
};
