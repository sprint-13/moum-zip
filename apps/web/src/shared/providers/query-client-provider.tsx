"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/lib/get-query-client";

interface QueryProvidersProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProvidersProps) {
  // 컴포넌트 생명주기와 무관하게 QueryClient를 관리합니다.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#streaming-with-server-components
