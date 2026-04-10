import { getTodayKST } from "@/entities/schedule";
import { SpaceCard } from "@/features/space";
import { type GrassDay, getGrassUseCase } from "@/features/space/use-cases/get-member-grass";
import { cn } from "@/shared/lib/cn";

interface DashboardGrassSectionProps {
  spaceId: string;
  userId: number;
}

const WEEK_COLUMN_SIZE = 7;
const WEEKDAY_LABEL_ROW_INDEXES = new Set([0, 2, 4, 6]);
const GRASS_LEGEND_ITEMS = [
  { intensity: 0, label: "0" },
  { intensity: 1, label: "1" },
  { intensity: 2, label: "2" },
  { intensity: 3, label: "3" },
  { intensity: 5, label: "5" },
  { intensity: 7, label: "7+" },
] as const;
const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });

export const DashboardGrassSection = async ({ spaceId, userId }: DashboardGrassSectionProps) => {
  const grass = await getGrassUseCase(spaceId, userId);
  const todayDateKey = getTodayKST();
  const weekColumns = chunkWeekColumns(grass.days);
  const monthLabels = getMonthLabels(weekColumns);
  const weekdayLabels = getWeekdayLabels(weekColumns);

  return (
    <SpaceCard>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-base">활동 잔디</h3>
          <p className="text-muted-foreground text-sm">최근 12주 동안의 스페이스 활동이에요.</p>
          <p className="text-[11px] text-muted-foreground">게시글 2점 · 댓글 1점 · 출석 1점</p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="rounded-lg bg-primary/15 px-3 py-2">
            <p className="text-muted-foreground text-xs">오늘 점수</p>
            <p className="font-semibold text-base">{grass.summary.todayScore}점</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-muted-foreground text-xs">현재 연속 활동</p>
            <p className="font-semibold text-base">{grass.summary.currentStreak}일</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-muted-foreground text-xs">최근 7일 점수</p>
            <p className="font-semibold text-base">{grass.summary.recentScore}점</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-fit justify-center">
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5">
              <div />
              <div className="flex gap-1.5 text-[9px] text-muted-foreground">
                {monthLabels.map(({ label, key }) => (
                  <span key={key} className="w-3.5 whitespace-nowrap leading-none">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-rows-7 gap-1 text-[10px] text-muted-foreground">
                {weekdayLabels.map(({ key, label }) => (
                  <span key={key} className="flex h-3.5 items-center">
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5 py-0.5">
                {weekColumns.map((week) => (
                  <div key={week[0]?.date ?? "empty-week"} className="grid grid-rows-7 gap-1">
                    {week.map((day) => {
                      const isToday = day.date === todayDateKey;

                      return (
                        <div
                          key={day.date}
                          role="img"
                          title={getGrassCellLabel(day, isToday)}
                          aria-label={getGrassCellLabel(day, isToday)}
                          className={cn(
                            "h-3.5 w-3.5 cursor-help rounded-[4px] border transition-colors transition-transform duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-110",
                            getGrassCellClassName(day.intensity),
                            isToday && "ring-1 ring-primary/60 ring-offset-1 ring-offset-background",
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-muted-foreground text-xs md:flex-row md:items-end md:justify-between">
          <span>활동한 날 {grass.summary.activeDays}일</span>

          <div className="flex flex-col gap-1.5 md:items-end">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-[3px] border border-primary/40 bg-muted/90 ring-1 ring-primary/60 ring-offset-1 ring-offset-background" />
              <span>테두리: 오늘</span>
            </div>

            <div className="flex flex-col gap-1 md:items-end">
              <span>활동 점수 기준</span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:justify-end">
                {GRASS_LEGEND_ITEMS.map(({ intensity, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className={cn("h-3 w-3 rounded-[3px] border", getGrassCellClassName(intensity))} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
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

const getMonthLabels = (weekColumns: Array<Array<{ date: string }>>) => {
  let previousMonth = "";

  return weekColumns.map((week) => {
    const date = week[0]?.date ?? "";
    const month = date ? formatMonthLabel(date) : "";
    const label = month !== previousMonth ? month : "";
    previousMonth = month;

    return {
      key: date || month,
      label,
    };
  });
};

const getWeekdayLabels = (weekColumns: Array<Array<{ date: string }>>) => {
  const firstWeek = weekColumns[0] ?? [];

  return Array.from({ length: WEEK_COLUMN_SIZE }, (_, index) => {
    const date = firstWeek[index]?.date;

    if (!date || !WEEKDAY_LABEL_ROW_INDEXES.has(index)) {
      return {
        key: `empty-${index}`,
        label: "",
      };
    }

    return {
      key: date,
      label: formatWeekdayLabel(date),
    };
  });
};

const getGrassCellClassName = (intensity: number) => {
  switch (intensity) {
    case 7:
      return "border-primary bg-primary";
    case 5:
      return "border-primary/90 bg-primary/85";
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

const formatDayLabel = (day: Pick<GrassDay, "date" | "score" | "postCount" | "commentCount" | "attendanceCount">) => {
  const attendanceLabel = day.attendanceCount > 0 ? "출석함" : "출석 안 함";

  return `${day.date} · ${day.score}점 · 게시글 ${day.postCount}개 · 댓글 ${day.commentCount}개 · ${attendanceLabel}`;
};

const getGrassCellLabel = (day: GrassDay, isToday = false) => {
  const baseLabel = formatDayLabel(day);

  return isToday ? `${baseLabel} · 오늘` : baseLabel;
};

const formatMonthLabel = (date: string) => {
  const targetDate = parseDateKey(date);

  return `${targetDate.getMonth() + 1}월`;
};

const formatWeekdayLabel = (date: string) => {
  return weekdayFormatter.format(parseDateKey(date));
};

const parseDateKey = (date: string) => new Date(`${date}T00:00:00+09:00`);
