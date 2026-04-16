"use client";

import { LoadingIndicator } from "@moum-zip/ui/components";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { loginWithKakao } from "@/_pages/auth/use-cases/social-login";
import { ROUTES } from "@/shared/config/routes";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    // 중복 실행 방지
    if (handledRef.current) return;
    handledRef.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // 카카오 로그인 실패 시 ?error=... 형태로 넘어오는 케이스 대비
    if (error || !code) {
      router.replace(ROUTES.login);
      return;
    }

    const handleCallback = async () => {
      try {
        // 카카오 인가 코드 -> access_token 교환 (Route Handler에서 처리)
        const tokenRes = await fetch(`/api/oauth/kakao?code=${code}`);
        if (!tokenRes.ok) {
          router.replace(ROUTES.login);
          return;
        }
        const { accessToken: kakaoAccessToken } = await tokenRes.json();

        // 카카오 access_token -> 백엔드 JWT 발급
        const { accessToken, refreshToken } = await loginWithKakao(kakaoAccessToken);

        // httpOnly 쿠키에 저장
        const res = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
          credentials: "include",
          referrerPolicy: "no-referrer",
        });

        if (res.ok) {
          // 쿠키 반영을 위해 홈으로 새 요청 (클라이언트 이동 X)
          window.location.replace(ROUTES.home);
        } else {
          router.replace(ROUTES.login);
        }
      } catch {
        router.replace(ROUTES.login);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return <LoadingIndicator fullScreen text="로그인 처리 중" />;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<LoadingIndicator fullScreen text="로그인 처리 중" />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
