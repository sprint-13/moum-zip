import { type NextRequest, NextResponse } from "next/server";

// 카카오 인가 코드 -> access_token 교환
// client_secret이 필요하기 때문에 브라우저가 아닌 서버(Route Handler)에서 처리
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "인가 코드가 없습니다." }, { status: 400 });
  }

  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ message: "카카오 토큰 교환 실패" }, { status: 400 });
  }

  const { access_token } = await tokenRes.json();

  return NextResponse.json({ accessToken: access_token });
}
