# 웹 에러 처리 기준

## 목적

웹 앱에서 에러 생성 방식과 UI 소비 방식을 일관되게 유지하기 위한 기준입니다.

- API, action, use-case에서 직접 `throw new Error(...)`를 새로 만들지 않습니다.
- 화면에서 `error.message.includes("401")` 같은 문자열 분기를 만들지 않습니다.
- 사용자 메시지는 공통 에러 유틸을 통해 소비합니다.

## 공통 에러 타입

현재 웹 앱은 아래 공통 에러 타입을 사용합니다.

- `ApiError`
- `AuthError`
- `DomainError`
- `ValidationError`
- `NotFoundError`

분류 기준은 아래와 같습니다.

- API 응답 실패, 네트워크 실패, 서버 오류: `ApiError`
- 인증 필요, 인증 만료, 권한 관련 인증 실패: `AuthError`
- 비즈니스 규칙 위반: `DomainError`
- 입력값 검증 실패: `ValidationError`
- 리소스 없음: `NotFoundError`

## 에러 코드 사용 기준

실제 분기 기준은 클래스보다 `code`를 우선합니다.

- 예: `UNAUTHORIZED`, `FORBIDDEN`, `NETWORK_ERROR`, `REQUEST_FAILED`
- 예: `POST_NOT_FOUND`, `COMMENT_NOT_FOUND`, `SCHEDULE_NOT_FOUND`
- 예: `VALIDATION_ERROR`, `INVALID_REQUEST`, `ALREADY_ATTENDED`

새 에러를 추가할 때는 먼저 기존 `ERROR_CODES`로 표현 가능한지 확인합니다.

## 어디서 무엇을 던질지

### API / query / action 호출부

- HTTP 실패는 `throwIfNotOk(...)` 또는 `normalizeApiError(...)`를 사용합니다.
- 응답 실패를 `throw new Error(...)`로 새로 만들지 않습니다.

예:

```ts
await throwIfNotOk(response, {
  fallbackMessage: "목록을 불러오지 못했습니다.",
});
```

### use-case

- 입력값 오류는 `ValidationError`
- 도메인 규칙 위반은 `DomainError`
- 리소스 없음은 `NotFoundError`
- 외부 API 호출 실패는 `ApiError`

메시지는 기존 사용자 메시지를 유지하되, 타입만 공통 구조로 맞춥니다.

### provider / internal invariant

아래 성격은 예외로 둡니다.

- provider 바깥에서 hook 사용
- 내부 유틸 계약 위반
- 테스트 시뮬레이션용 에러

이 경우는 일반 `Error`를 유지해도 됩니다.

## UI에서 에러 소비하는 방법

### 사용자 메시지

UI에서는 에러를 직접 해석하지 않고 아래 유틸을 사용합니다.

- `getErrorPresentation(error)`
- `getErrorMessage(error)`

기본 원칙은 아래와 같습니다.

- 컴포넌트 / 클라이언트 UI: `getErrorPresentation(error).message`
- 서버 액션 / 서버 로직 반환값: `await getErrorMessage(error)`

예:

```ts
toast({
  message: getErrorPresentation(error).message,
  size: "small",
});
```

```ts
return {
  ok: false,
  error: await getErrorMessage(error, {
    fallbackMessage: "처리에 실패했습니다.",
  }),
};
```

### 금지 패턴

- `err instanceof Error ? err.message : ...`
- `error.message.includes("401")`
- 화면별 에러 메시지 화이트리스트 분기

## Query / Mutation 기본 정책

`QueryClient` 전역 기본 정책은 아래와 같습니다.

- `query`
  - 네트워크/서버 계열 에러만 최대 1회 재시도
  - 검증/권한/도메인/404 계열은 재시도하지 않음
- `mutation`
  - 기본 재시도 없음

즉, 화면마다 같은 `retry` 기준을 반복하지 않고 공통 정책을 사용합니다.

## 현재 예외로 남겨둔 것

현재 `throw new Error(...)`가 남아 있는 곳은 아래 성격입니다.

- provider invariant
- 내부 유틸 invariant
- 테스트 코드

이 범위는 에러 중앙화 대상에서 제외합니다.

## 다음 단계

Sentry 머지 후 아래를 이어서 적용합니다.

- `shouldReport` 기준으로 공통 로깅 연결
- 인증/검증/예상 가능한 도메인 에러는 보고 제외
- 서버 오류/네트워크 오류/예상 밖 오류만 보고
