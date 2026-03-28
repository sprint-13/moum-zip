type ErrorHandlers = {
  /** HTTP 상태 코드별 핸들러. redirect/notFound/throw처럼 never를 반환해야 한다. */
  [status: number]: (err: unknown) => never;
  /** Promise가 resolve됐지만 null/undefined인 경우 (DB 레코드 없음 등) */
  notFound?: () => never;
  /** 위 핸들러에 매칭되지 않는 모든 에러. 발생한 에러 객체를 인자로 받는다. */
  default?: (err?: unknown) => never;
};

/**
 * Promise를 실행하고 에러를 핸들러로 처리한다.
 * 핸들러는 반드시 never를 반환해야 하므로(redirect, notFound, throw),
 * 반환 타입은 항상 NonNullable<T>로 보장된다.
 *
 * useSuspenseQuery와 같은 원리:
 * - 데이터가 없는 케이스는 핸들러가 제어 흐름을 이탈시킴
 * - safe() 이후 코드는 항상 유효한 데이터를 가짐
 */

export async function safe<T>(promise: Promise<T>, handlers: ErrorHandlers = {}): Promise<NonNullable<T>> {
  let result: T;

  try {
    result = await promise;
  } catch (err) {
    // biome-ignore lint: error-handling: 다양한 형태의 에러 객체를 고려하여 status 코드를 추출
    const status = (err as any)?.status ?? (err as any)?.response?.status;

    if (status !== undefined && handlers[status]) {
      return handlers[status](err);
    }

    if (handlers.default) {
      return handlers.default(err);
    }

    throw err;
  }

  // resolve됐지만 null/undefined인 경우 (DB findFirst 등)
  if (result == null) {
    if (handlers.notFound) {
      return handlers.notFound();
    }
    if (handlers.default) {
      return handlers.default(new Error("Received null/undefined result"));
    }
    throw new Error("[safe] null/undefined 결과를 받았지만 notFound 핸들러가 없습니다.");
  }

  return result as NonNullable<T>;
}
