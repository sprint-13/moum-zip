import { cookies } from "next/headers";

export interface Session {
  userId: number;
  token: string;
}

/**
 * 서버 컴포넌트 / Server Action / Route Handler에서 현재 세션을 가져온다.
 * 세션이 없으면 null을 반환한다.
 *
 * NOTE: 현재는 쿠키에서 userId를 직접 읽는 구조.
 * JWT 검증 또는 외부 세션 API로 교체 가능.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (!token || !userId) return null;

  return { token, userId: Number(userId) };
}
