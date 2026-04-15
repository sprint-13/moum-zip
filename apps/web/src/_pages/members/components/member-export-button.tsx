"use client";

import { toast } from "@moum-zip/ui/components";
import { useState } from "react";
import { exportMemberGrassAction, exportMembersAction } from "@/_pages/members/action";
import { useSpaceContext } from "@/features/space";
import type { GrassDay } from "@/features/space/use-cases/get-member-grass";

const toBase64Font = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`폰트 로드 실패: ${url} (${res.status})`);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return window.btoa(binary);
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function MemberExportButton() {
  const { space } = useSpaceContext();
  const [isPending, setIsPending] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsPending(true);

      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const [regularBase64, boldBase64] = await Promise.all([
        toBase64Font("/fonts/Pretendard-Regular.ttf"),
        toBase64Font("/fonts/Pretendard-Bold.ttf"),
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

      // 1페이지: 멤버 목록
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${space.name} 멤버 목록`, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(136, 136, 136);
      doc.text(`총 ${members.length}명 · ${exportedAt} 기준`, 14, 28);

      autoTable(doc, {
        startY: 35,
        head: [["이름", "이메일", "역할", "가입일"]],
        body: members.map((m) => [m.nickname, m.email, m.role, formatDate(m.joinedAt)]),
        styles: { font: "Pretendard", fontStyle: "normal", fontSize: 9 },
        headStyles: {
          font: "Pretendard",
          fontStyle: "bold",
          fontSize: 9,
          fillColor: [245, 245, 245],
          textColor: [85, 85, 85],
        },
      });

      // 멤버별 잔디 페이지
      members.forEach((member, index) => {
        const grass = grassList[index];
        doc.addPage();

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`${member.nickname} · 활동 잔디 리포트`, 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(136, 136, 136);
        doc.text(`${member.role} · 활동한 날 ${grass.summary.activeDays}일`, 14, 28);

        // 요약 테이블
        autoTable(doc, {
          startY: 35,
          head: [["오늘 점수", "현재 연속 활동", "최근 7일 점수"]],
          body: [
            [`${grass.summary.todayScore}점`, `${grass.summary.currentStreak}일`, `${grass.summary.recentScore}점`],
          ],
          styles: { font: "Pretendard", fontStyle: "normal", fontSize: 9 },
          headStyles: {
            font: "Pretendard",
            fontStyle: "bold",
            fontSize: 9,
            fillColor: [245, 245, 245],
            textColor: [85, 85, 85],
          },
        });

        // 잔디 그리드
        const gridStartY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(9);
        doc.setTextColor(85, 85, 85);
        doc.text("최근 12주 활동", 14, gridStartY);

        const cellSize = 4;
        const cellGap = 1.5;
        const gridX = 14;
        const gridY = gridStartY + 5;
        const weeks = chunkWeekColumns(grass.days);

        weeks.forEach((week, colIndex) => {
          week.forEach((day, rowIndex) => {
            const x = gridX + colIndex * (cellSize + cellGap);
            const y = gridY + rowIndex * (cellSize + cellGap);
            const color = getGrassColor(day.intensity);
            doc.setFillColor(...color);
            doc.setDrawColor(220, 220, 220);
            doc.roundedRect(x, y, cellSize, cellSize, 0.8, 0.8, "FD");
          });
        });

        // 활동 상세 테이블
        const activeDays = grass.days.filter((d: GrassDay) => d.score > 0);
        const tableStartY = gridY + 7 * (cellSize + cellGap) + 10;

        autoTable(doc, {
          startY: tableStartY,
          head: [["날짜", "점수", "게시글", "댓글", "출석"]],
          body: activeDays.map((d: GrassDay) => [
            d.date,
            `${d.score}점`,
            `${d.postCount}개`,
            `${d.commentCount}개`,
            d.attendanceCount > 0 ? "O" : "-",
          ]),
          styles: { font: "Pretendard", fontStyle: "normal", fontSize: 9 },
          headStyles: {
            font: "Pretendard",
            fontStyle: "bold",
            fontSize: 9,
            fillColor: [245, 245, 245],
            textColor: [85, 85, 85],
          },
        });
      });

      doc.save(`${space.name}_멤버리포트_${exportedAt}.pdf`);
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "export에 실패했습니다.", size: "small" });
    } finally {
      setIsPending(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsPending(true);
      const members = await exportMembersAction(space.slug);
      const exportedAt = new Date().toLocaleDateString("ko-KR");

      const header = "이름,이메일,역할,가입일\n";
      const rows = members.map((m) => `${m.nickname},${m.email},${m.role},${formatDate(m.joinedAt)}`).join("\n");
      const csv = `\uFEFF${header}${rows}`;

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${space.name}_멤버목록_${exportedAt}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "export에 실패했습니다.", size: "small" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted disabled:opacity-50"
      >
        PDF 내보내기
      </button>
      <button
        type="button"
        onClick={handleExportCsv}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted disabled:opacity-50"
      >
        CSV 내보내기
      </button>
    </div>
  );
}

const chunkWeekColumns = (items: GrassDay[]) =>
  Array.from({ length: Math.ceil(items.length / 7) }, (_, i) => items.slice(i * 7, (i + 1) * 7));

const getGrassColor = (intensity: number): [number, number, number] => {
  switch (intensity) {
    case 7:
      return [99, 102, 241]; // primary
    case 5:
      return [129, 132, 245];
    case 3:
      return [165, 167, 249];
    case 2:
      return [199, 200, 252];
    case 1:
      return [225, 226, 254];
    default:
      return [240, 240, 240]; // muted
  }
};
