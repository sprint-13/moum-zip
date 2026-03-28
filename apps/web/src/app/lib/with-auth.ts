import type { HttpResponse } from "@moum-zip/api";
import { redirect } from "next/navigation";
import { refreshAction } from "@/_pages/auth/actions";
import { apiClient } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

type ApiClient = Awaited<ReturnType<typeof apiClient>>;

/**
 * 인증이 필요한 API 호출 시 사용하는 래퍼 함수
 * 401 응답 시 토큰 갱신 후 재시도 (1회), 갱신 실패 시 /login으로 redirect
 * 403 응답 시 바로 /login으로 redirect
 * 서버 컴포넌트 / 서버 액션 전용
 *
 * @example
 * const data = await withAuth((client) => client.user.getUser());
 */
export async function withAuth<T>(fn: (client: ApiClient) => Promise<T>): Promise<T> {
  const client = await apiClient();

  try {
    return await fn(client);
  } catch (error) {
    // error가 항상 HttpResponse라는 보장이 없어서
    // Response 객체인지 먼저 확인 후 status를 꺼냄
    const status = error instanceof Response ? error.status : (error as HttpResponse<unknown, unknown>)?.status;

    if (status === 401) {
      // accessToken 만료 → refreshToken으로 갱신 시도
      const { ok } = await refreshAction();

      if (ok) {
        // 갱신 성공 → 새 토큰으로 client 생성 후 1회 재시도
        // 기존 client를 재사용하면 만료된 토큰이 그대로 실릴 수 있어서 새로 생성
        const newClient = await apiClient();
        try {
          return await fn(newClient);
        } catch (retryError) {
          // Response 객체인지 먼저 확인 후 status를 꺼냄
          const retryStatus =
            retryError instanceof Response ? retryError.status : (retryError as HttpResponse<unknown, unknown>)?.status;

          // 재시도 실패 시 401/403만 로그인으로 redirect
          if (retryStatus === 401 || retryStatus === 403) return redirect(ROUTES.login);
          throw retryError;
        }
      }

      // 갱신 실패
      return redirect(ROUTES.login);
    }

    // 권한 없음
    if (status === 403) {
      return redirect(ROUTES.login);
    }

    // 인증 외 에러는 호출한 쪽으로 넘김
    throw error;
  }
}
