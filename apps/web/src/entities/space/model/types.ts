export interface SpaceInfo {
  id: string; // 스페이스 고유 아이디
  name: string; // 스페이스 이름
  thumbnailUrl?: string;
  status: "archived" | "ongoing"; // 종료 여부
  maxParticipants: number; // 최대 참여자 수
  currentParticipants: number; // 현재 참여자 수
  category: "study" | "project"; // 스터디 OR 프로젝트 카테고리
  location: string | null; // 위치
  color: string; // 스페이스 고유 컬러 (프론트에서 사용)
  startDate: string; // 시작 일자
  endDate?: string; // 종료 일자 (선택)
}
