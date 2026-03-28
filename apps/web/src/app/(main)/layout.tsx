import { Toaster } from "@moum-zip/ui/components";
import { QueryProvider } from "@/shared/providers/query-client-provider";
import { NavigationMenu } from "@/shared/ui/navigation-menu";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NavigationMenu />
      <main>{children}</main>
      <Toaster />
    </QueryProvider>
  );
}
