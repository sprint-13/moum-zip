interface TokenPayload {
  sub: string | number; // 유저 ID
  exp: number; // 만료 시각
  iat: number; // 발급 시각
}

// 파싱된 JSON이 진짜 TokenPayload 형태인지 검증
function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    // sub가 string 또는 number 둘 다 허용
    (typeof (value as { sub?: unknown }).sub === "string" || typeof (value as { sub?: unknown }).sub === "number") &&
    typeof (value as { exp?: unknown }).exp === "number" &&
    Number.isFinite((value as { exp?: number }).exp) &&
    typeof (value as { iat?: unknown }).iat === "number" &&
    Number.isFinite((value as { iat?: number }).iat)
  );
}

export const TokenService = {
  decode(token: string): TokenPayload | null {
    try {
      const base64 = token.split(".")[1];
      if (!base64) return null;

      const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
      const payload: unknown = JSON.parse(Buffer.from(normalized, "base64").toString("utf-8"));
      return isTokenPayload(payload) ? payload : null; // 검증 추가
    } catch {
      return null;
    }
  },

  // 토큰이 유효한 지 확인
  isValid(token: string): boolean {
    const payload = this.decode(token);
    if (!payload) return false;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
  },

  // 토큰 만료까지 남은 시간 (쿠키 maxAge 용도)
  getExpiresIn(token: string): number {
    const payload = this.decode(token);
    if (!payload) return 0;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - nowInSeconds); // 토큰 음수 방지
  },
};
