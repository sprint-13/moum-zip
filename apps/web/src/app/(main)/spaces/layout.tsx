import { redirect } from "next/navigation";
import { isAuth } from "@/shared/api/server";

export default async function SpacesLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuth();
  // TODO: 모달로 로그인 해야하는 것을 알려주기. 버튼 누르면 Redirect
  if (!auth.authenticated || auth.userId == null) redirect("/");

  return <>{children}</>;
}
