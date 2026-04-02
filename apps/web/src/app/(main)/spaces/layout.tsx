import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAuth } from "@/shared/api/server";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = await isAuth();
  // TODO: 모달로 로그인 해야하는 것을 알려주기. 버튼 누르면 Redirect
  if (!auth.authenticated || auth.userId == null) redirect("/");

  return <>{children}</>;
}

export default function SpacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
