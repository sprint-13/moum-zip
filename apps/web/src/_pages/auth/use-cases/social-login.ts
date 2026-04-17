import { API_BASE_URL, TEAM_ID } from "@/shared/config/env";

/**
 * 구글 소셜 로그인
 * Google Identity Services SDK로 받은 access_token을 백엔드로 전달
 * 백엔드가 토큰 검증 후 자체 JWT(accessToken, refreshToken) 발급
 */
export async function loginWithGoogle(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/${TEAM_ID}/oauth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: accessToken }),
  });

  if (!res.ok) throw new Error("구글 로그인 실패");
  return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
}

/**
 * 카카오 소셜 로그인
 * Next.js Route Handler에서 카카오 access_token으로 교환 후 백엔드로 전달
 * 백엔드가 토큰 검증 후 자체 JWT(accessToken, refreshToken) 발급
 */
export async function loginWithKakao(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/${TEAM_ID}/oauth/kakao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: accessToken }),
  });

  if (!res.ok) throw new Error("카카오 로그인 실패");
  return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
}
