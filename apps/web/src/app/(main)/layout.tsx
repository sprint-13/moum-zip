import { Toaster } from "@moum-zip/ui/components";
import { Suspense } from "react";
import { QueryProvider } from "@/shared/providers/query-client-provider";
import { NavigationMenu } from "@/shared/ui/navigation-menu";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense>
        <NavigationMenu />
      </Suspense>
      <Suspense>
        <main>{children}</main>
      </Suspense>
      <Toaster />
    </QueryProvider>
  );
}
