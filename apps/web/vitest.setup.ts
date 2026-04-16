import { vi } from "vitest";

// 테스트 환경(jsdom)에서는 실제 DB 연결이 없으므로
// @/shared/db 모듈 전체를 가짜(mock)로 대체합니다.
// 각 테스트 파일에서 vi.mocked(db.insert).mockResolvedValue(...) 등으로
// 원하는 반환값을 설정할 수 있습니다.
vi.mock("@/shared/db", () => ({
  db: {
    query: {},
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
  },
}));
