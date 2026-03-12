"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // 서버에서는 클라이언트마다 항상 새로운 QueryClient를 생성합니다.
    return makeQueryClient();
  } else {
    // 브라우저에서는 QueryClient를 한 번만 생성하여 재사용합니다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProvidersProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProvidersProps) {
  // 컴포넌트 생명주기와 무관하게 QueryClient를 관리합니다.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#streaming-with-server-components
