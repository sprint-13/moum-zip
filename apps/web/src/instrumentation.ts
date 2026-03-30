export async function register() {
  // Next.js의 Node.js 런타임에서만 실행되도록 제한
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const originalFetch = global.fetch;

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const start = performance.now();

      // 호출된 URL 추출
      const url = input instanceof Request ? input.url : input.toString();

      try {
        const response = await originalFetch(input, init);
        const end = performance.now();
        const duration = (end - start).toFixed(2);

        // 터미널/Vercel 로그에 출력
        console.log(`[🌐 API CALL] ${duration}ms | ${url} | Status: ${response.status}`);

        return response;
      } catch (error) {
        const end = performance.now();
        console.error(`[❌ API ERROR] ${(end - start).toFixed(2)}ms | ${url}`);
        throw error;
      }
    };
  }
}
