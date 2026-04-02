"use client";

import { LoadingIndicator } from "@moum-zip/ui/components";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { ROUTES } from "@/shared/config/routes";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    // 토큰 처리 중복 실행 방지
    if (handledRef.current) return;
    handledRef.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    // 백엔드 OAuth 실패 시 ?error=... 형태로 넘어오는 케이스 대비
    const error = searchParams.get("error");

    // 토큰이 없거나 에러가 있으면 로그인 페이지로 이동
    if (error || !accessToken || !refreshToken) {
      router.replace(ROUTES.login);
      return;
    }

    const handleCallback = async () => {
      try {
        // 토큰을 URL에서 즉시 제거 (히스토리/Referer 헤더로 토큰 노출 방지)
        window.history.replaceState({}, "", window.location.pathname);

        // httpOnly 쿠키는 서버에서만 set 가능하므로 Route Handler에 위임
        const res = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
          credentials: "include",
          referrerPolicy: "no-referrer", // Referer 헤더로 토큰 노출 방지
        });

        if (res.ok) {
          // router.replace는 서버 컴포넌트를 재실행하지 않아 네비게이션 상태가 바뀌지 않음
          // 풀 리로드로 쿠키 반영
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

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingIndicator fullScreen text="로그인 처리 중" />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
