import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockAuthInstance, mockMeetingsInstance, mockReviewsInstance } = vi.hoisted(() => {
  return {
    mockAuthInstance: {
      loginCreate: vi.fn(),
      googleCallbackList: vi.fn(),
    },
    mockMeetingsInstance: {
      meetingsDetail: vi.fn(),
    },
    mockReviewsInstance: {
      reviewsList: vi.fn(),
    },
  };
});

vi.mock("@moum-zip/api/index", () => {
  return {
    Auth: class {
      constructor() {
        // biome-ignore lint: to mock class in test
        return mockAuthInstance;
      }
    },
    Meetings: class {
      constructor() {
        // biome-ignore lint: to mock class in test
        return mockMeetingsInstance;
      }
    },
    Reviews: class {
      constructor() {
        // biome-ignore lint: to mock class in test
        return mockReviewsInstance;
      }
    },
    Favorites: class {},
    Images: class {},
    MeetingTypes: class {},
    Notifications: class {},
    Posts: class {},
    Users: class {},
  };
});

// 테스트할 대상인 api 객체를 가져옵니다. (위에서 모킹된 클래스들이 주입되어 생성됨)
import { api } from "./index";

// index.ts 에 정의된 기본 teamId 값을 상수로 정의합니다.
const MOCK_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID || "moum-zip-dev";

describe("shared/api/index.ts Wrapper Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("필수 파라미터 주입 검증", () => {
    it("api.meetings.getDetail(123) 호출 시 core.meetings.meetingsDetail('moum-zip', 123) 형태로 실행되어야 한다.", () => {
      const meetingId = 123;

      // 테스트 대상 함수 호출
      api.meetings.getDetail(meetingId);

      // 의도한 대로 teamId와 meetingId가 순서대로 잘 전달되었는지 확인
      expect(mockMeetingsInstance.meetingsDetail).toHaveBeenCalledWith(MOCK_TEAM_ID, meetingId);
      expect(mockMeetingsInstance.meetingsDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe("선택적 파라미터 유지 파악 검증", () => {
    it("api.reviews.getList(query, params) 호출 시 query, params가 유실 없이 잘 전달되어야 한다.", () => {
      // 넘어가는 가짜 데이터 세팅
      const dummyQuery = { type: "online", size: 10 };
      const dummyParams = { cache: "no-store" };

      // 테스트 대상 함수 호출 (query와 params 모두 전달)
      // @ts-expect-error
      api.reviews.getList(dummyQuery, dummyParams);

      // 의도한 대로 teamId 뒤에 query와 params가 순서대로 전달되었는지 확인
      expect(mockReviewsInstance.reviewsList).toHaveBeenCalledWith(MOCK_TEAM_ID, dummyQuery, dummyParams);
    });

    it("api.reviews.getList() 처럼 인자 없이 호출해도 오류가 나지 않고 undefined 형태로 전달되어야 한다.", () => {
      api.reviews.getList();

      // 인자를 넣지 않았을 때는 인자 자리에 undefined로 떨어져야 함 (js 동작 방식 특성 상)
      expect(mockReviewsInstance.reviewsList).toHaveBeenCalledWith(MOCK_TEAM_ID, undefined, undefined);
    });
  });

  describe("teamId가 필요 없는 예외 함수 맵핑 검증", () => {
    it("api.auth.googleCallback 함수는 core.auth.googleCallbackList 원본 함수와 동일한 레퍼런스를 가져야 한다.", () => {
      // 원래 의도: 래퍼 함수( () => ... )를 만들지 않고 원본 메서드를 그대로 맵핑함
      // 따라서 api.auth.googleCallback 은 내부 auth 인스턴스의 googleCallbackList와 완전히 같은(참조) 함수여야 합니다.
      expect(api.auth.googleCallback).toEqual(mockAuthInstance.googleCallbackList);
    });
  });
});
