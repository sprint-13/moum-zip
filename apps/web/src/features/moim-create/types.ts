// TODO: 스페이스 기능 선택 방식 확정 후 값 추가 예정
export type SpaceFunction = "bulletin" | "schedule" | "members";

export interface MoimCreateRequest {
  type: "study" | "project"; // 모임 종류
  name: string; // 모임 이름
  capacity: number; // 모집 인원
  description: string; // 모임 설명
  image: string; // 이미지
  location: "online" | "offline"; // 장소
  date: string; // 모임 일정
  time: string; // 모임 시간
  deadlineDate: string; // 모집 마감 날짜
  deadlineTime: string; // 모집 마감 시간
  themeColor: string; // 테마 컬러
  options?: SpaceFunction[]; // 스페이스 기능 옵션 (선택)
}
