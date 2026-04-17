"use client";

import { toast } from "@moum-zip/ui/components";
import { useState } from "react";
import { exportMemberGrassAction, exportMembersAction } from "@/_pages/members/action";
import { THEME_COLORS } from "@/entities/moim";
import { useSpaceContext } from "@/features/space";
import type { GrassDay } from "@/features/space/use-cases/get-member-grass";

const PDF_STYLES = {
  title: { size: 16, color: [0, 0, 0] as const },
  subtitle: { size: 10, color: [100, 100, 100] as const },
  table: {
    body: {
      font: "Pretendard",
      fontStyle: "normal" as const,
      fontSize: 9,
      textColor: [30, 30, 30] as [number, number, number],
    },
    head: {
      font: "Pretendard",
      fontStyle: "bold" as const,
      fontSize: 9,
      fillColor: [50, 50, 50] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
    },
    alternateRow: {
      fillColor: [235, 235, 235] as [number, number, number],
    },
  },
} as const;

const GRASS_GRID = {
  cellSize: 4,
  cellGap: 1.5,
  originX: 14,
  rowsPerWeek: 7,
} as const;

/** intensity → 불투명도 매핑 */
const INTENSITY_ALPHA: Record<number, number> = {
  7: 1.0,
  5: 0.75,
  3: 0.5,
  2: 0.3,
  1: 0.15,
};

const DEFAULT_THEME_COLOR = "#00BD7E";

const formatDate = (isoString: string) => {
  if (!isoString || isoString === "-") return "-";
  return new Date(isoString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

const grassColor = (intensity: number, [r, g, b]: [number, number, number]): [number, number, number] => {
  const alpha = INTENSITY_ALPHA[intensity] ?? 0;
  return [lerp(240, r, alpha), lerp(240, g, alpha), lerp(240, b, alpha)];
};

/** days 배열을 7일씩 주(week) 단위 컬럼으로 묶기 */
const groupByWeeks = (days: GrassDay[]): GrassDay[][] =>
  Array.from({ length: Math.ceil(days.length / 7) }, (_, i) => days.slice(i * 7, (i + 1) * 7));

const getLastTableY = (doc: JsPDFWithAutoTable): number =>
  (doc as JsPDFWithAutoTable & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

const toBase64Font = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`폰트 로드 실패: ${url} (${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  return window.btoa(bytes.reduce((s, b) => s + String.fromCharCode(b), ""));
};

const toBase64Image = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 로드 실패: ${url} (${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  return window.btoa(bytes.reduce((s, b) => s + String.fromCharCode(b), ""));
};

type JsPDFWithAutoTable = import("jspdf").jsPDF;
type AutoTableFn = typeof import("jspdf-autotable").default;

const drawPageHeader = (doc: JsPDFWithAutoTable, title: string, subtitle: string, logoBase64: string) => {
  doc.addImage(logoBase64, "PNG", 14, 21, 13, 4.5);

  doc.setFont("Pretendard", "bold");
  doc.setFontSize(PDF_STYLES.title.size);
  doc.setTextColor(...PDF_STYLES.title.color);
  doc.text(title, 30, 26);

  doc.setFont("Pretendard", "normal");
  doc.setFontSize(PDF_STYLES.subtitle.size);
  doc.setTextColor(...PDF_STYLES.subtitle.color);
  doc.text(subtitle, 14, 33);
};

/** 그리드 하단 Y 좌표를 반환 */
const drawGrassGrid = (
  doc: JsPDFWithAutoTable,
  days: GrassDay[],
  startY: number,
  baseColor: [number, number, number],
) => {
  const { cellSize, cellGap, originX, rowsPerWeek } = GRASS_GRID;

  doc.setFontSize(9);
  doc.setTextColor(85, 85, 85);
  doc.text("최근 12주 활동", originX, startY);

  const gridY = startY + 5;
  groupByWeeks(days).forEach((week, col) => {
    week.forEach((day, row) => {
      const x = originX + col * (cellSize + cellGap);
      const y = gridY + row * (cellSize + cellGap);
      doc.setFillColor(...grassColor(day.intensity, baseColor));
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(x, y, cellSize, cellSize, 0.8, 0.8, "FD");
    });
  });

  return gridY + rowsPerWeek * (cellSize + cellGap);
};

const addMemberListPage = (
  doc: JsPDFWithAutoTable,
  autoTable: AutoTableFn,
  members: Awaited<ReturnType<typeof exportMembersAction>>,
  grassList: Awaited<ReturnType<typeof exportMemberGrassAction>>[],
  spaceName: string,
  exportedAt: string,
  logoBase64: string,
) => {
  drawPageHeader(doc, `${spaceName} 멤버 목록`, `총 ${members.length}명 · ${exportedAt} 기준`, logoBase64);

  autoTable(doc, {
    startY: 40,
    head: [["이름", "이메일", "역할", "가입일"]],
    body: members.map((m) => [m.nickname, m.email, m.role, formatDate(m.joinedAt)]),
    styles: PDF_STYLES.table.body,
    headStyles: PDF_STYLES.table.head,
    alternateRowStyles: PDF_STYLES.table.alternateRow,
  });

  const ranked = members
    .map((m, i) => ({
      ...m,
      totalScore: grassList[i].days.reduce((sum: number, d: GrassDay) => sum + d.score, 0),
      activeDays: grassList[i].summary.activeDays,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  autoTable(doc, {
    startY: getLastTableY(doc) + 12,
    head: [["순위", "이름", "12주 총점", "활동한 날"]],
    body: ranked.map((m, i) => [`${i + 1}위`, m.nickname, `${m.totalScore}점`, `${m.activeDays}일`]),
    styles: PDF_STYLES.table.body,
    headStyles: PDF_STYLES.table.head,
    alternateRowStyles: PDF_STYLES.table.alternateRow,
  });
};

const escapeCSV = (value: string | number): string => {
  const str = String(value);
  if (/^[=+\-@]/.test(str)) return `'${str}`;
  if (/[,"\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const addMemberGrassPage = (
  doc: JsPDFWithAutoTable,
  autoTable: AutoTableFn,
  member: Awaited<ReturnType<typeof exportMembersAction>>[number],
  grass: Awaited<ReturnType<typeof exportMemberGrassAction>>,
  baseColor: [number, number, number],
  logoBase64: string,
) => {
  doc.addPage();

  const bestDay =
    grass.days.length > 0
      ? grass.days.reduce((best: GrassDay, d: GrassDay) => (d.score > best.score ? d : best), grass.days[0])
      : null;

  drawPageHeader(
    doc,
    `${member.nickname} · 활동 잔디 리포트`,
    `${member.role} · 활동한 날 ${grass.summary.activeDays}일 · 최고 점수 ${
      bestDay ? `${bestDay.date} (${bestDay.score}점)` : "-"
    }`,
    logoBase64,
  );

  autoTable(doc, {
    startY: 40,
    head: [["오늘 점수", "현재 연속 활동", "최근 7일 점수"]],
    body: [[`${grass.summary.todayScore}점`, `${grass.summary.currentStreak}일`, `${grass.summary.recentScore}점`]],
    styles: PDF_STYLES.table.body,
    headStyles: PDF_STYLES.table.head,
    alternateRowStyles: PDF_STYLES.table.alternateRow,
  });

  const gridBottom = drawGrassGrid(doc, grass.days, getLastTableY(doc) + 10, baseColor);

  const activeDays = grass.days.filter((d: GrassDay) => d.score > 0);
  autoTable(doc, {
    startY: gridBottom + 10,
    head: [["날짜", "점수", "게시글", "댓글", "출석"]],
    body: activeDays.map((d: GrassDay) => [
      d.date,
      `${d.score}점`,
      `${d.postCount}개`,
      `${d.commentCount}개`,
      d.attendanceCount > 0 ? "O" : "-",
    ]),
    styles: PDF_STYLES.table.body,
    headStyles: PDF_STYLES.table.head,
    alternateRowStyles: PDF_STYLES.table.alternateRow,
  });
};

export function MemberExportButton() {
  const { space } = useSpaceContext();
  const [isPending, setIsPending] = useState(false);

  /** 로딩 상태 + 에러 토스트를 공통 처리하는 export 래퍼 */
  const withExport = async (fn: () => Promise<void>) => {
    try {
      setIsPending(true);
      await fn();
    } catch (error) {
      toast({
        message: error instanceof Error ? error.message : "export에 실패했습니다.",
        size: "small",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleExportPdf = () =>
    withExport(async () => {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const [regularBase64, boldBase64, logoBase64] = await Promise.all([
        toBase64Font("/fonts/Pretendard-Regular.ttf"),
        toBase64Font("/fonts/Pretendard-Bold.ttf"),
        toBase64Image("/images/moum-zip-logo.png"),
      ]);

      const doc = new jsPDF();
      doc.addFileToVFS("Pretendard-Regular.ttf", regularBase64);
      doc.addFileToVFS("Pretendard-Bold.ttf", boldBase64);
      doc.addFont("Pretendard-Regular.ttf", "Pretendard", "normal");
      doc.addFont("Pretendard-Bold.ttf", "Pretendard", "bold");
      doc.setFont("Pretendard", "normal");

      const members = await exportMembersAction(space.slug);
      const grassList = await Promise.all(members.map((m) => exportMemberGrassAction(space.slug, m.userId)));
      const exportedAt = new Date().toLocaleDateString("ko-KR");

      const themeHex = THEME_COLORS.find((t) => t.value === space.themeColor)?.color ?? DEFAULT_THEME_COLOR;
      const baseColor = hexToRgb(themeHex);

      addMemberListPage(doc, autoTable, members, grassList, space.name, exportedAt, logoBase64);
      members.forEach((member, i) => {
        addMemberGrassPage(doc, autoTable, member, grassList[i], baseColor, logoBase64);
      });

      doc.save(`${space.name}_멤버리포트_${exportedAt}.pdf`);
    });

  const handleExportCsv = () =>
    withExport(async () => {
      const members = await exportMembersAction(space.slug);
      const grassList = await Promise.all(members.map((m) => exportMemberGrassAction(space.slug, m.userId)));
      const exportedAt = new Date().toLocaleDateString("ko-KR");

      const header = "이름,이메일,역할,가입일,12주 총점,활동한 날,현재 연속 활동,오늘 점수,최근 7일 점수\n";
      const rows = members
        .map((m, i) => {
          const grass = grassList[i];
          const totalScore = grass.days.reduce((sum: number, d: GrassDay) => sum + d.score, 0);
          return [
            m.nickname,
            m.email,
            m.role,
            formatDate(m.joinedAt),
            totalScore,
            grass.summary.activeDays,
            grass.summary.currentStreak,
            grass.summary.todayScore,
            grass.summary.recentScore,
          ]
            .map(escapeCSV)
            .join(",");
        })
        .join("\n");

      const blob = new Blob([`\uFEFF${header}${rows}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${space.name}_멤버목록_${exportedAt}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });

  return (
    <div className="flex gap-2">
      <ExportButton onClick={handleExportPdf} disabled={isPending}>
        PDF 내보내기
      </ExportButton>
      <ExportButton onClick={handleExportCsv} disabled={isPending}>
        CSV 내보내기
      </ExportButton>
    </div>
  );
}

function ExportButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted disabled:opacity-50"
    >
      {children}
    </button>
  );
}
