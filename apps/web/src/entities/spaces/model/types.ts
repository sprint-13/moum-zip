export interface SpaceInfo {
  spaceId: string; // 스페이스 고유 아이디
  slug: string; // 스페이스 URL 슬러그
  name: string; // 스페이스 이름
  image: string | null;
  status: "archived" | "ongoing"; // 종료 여부
  capacity: number; // 현재 참여자 수
  type: "study" | "project"; // 스터디 OR 프로젝트 카테고리
  location: string | null; // 위치
  themeColor: string; // 스페이스 고유 컬러 (프론트에서 사용)
  startDate: string | null; // 시작 일자
  modules: string[]; // 활성화된 모듈 목록
  isApproved: boolean; // space_members 테이블에 존재하는지 여부 (승인 여부)
}
