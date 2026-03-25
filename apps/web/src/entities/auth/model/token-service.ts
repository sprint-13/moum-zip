interface TokenPayload {
  sub: string; // 유저 ID
  exp: number; // 만료 시각
  iat: number; // 발급 시각
}

export const TokenService = {
  decode(token: string): TokenPayload | null {
    try {
      const base64 = token.split(".")[1];

      const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");

      return JSON.parse(Buffer.from(normalized, "base64").toString("utf-8"));
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
