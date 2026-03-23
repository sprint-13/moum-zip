// apps/web/src/shared/ui/navigation-menu.tsx
"use client";
import { Gnb, Sheet } from "@moum-zip/ui/components";
import { Menu } from "@moum-zip/ui/icons";
import Link from "next/link";
import Logo from "@/shared/assets/moum-zip-logo.svg";

const ROUTES = [
  { label: "모임 찾기", href: "/search" },
  { label: "찜한 모임", href: "/favorites" },
  { label: "스페이스", href: "/space" },
];

const logo = <Logo className="block h-8 w-auto" aria-hidden preserveAspectRatio="xMidYMid meet" />;

export const NavigationMenu = () => {
  return (
    <>
      <div className="hidden w-full py-5 md:block">
        <Gnb viewport={false}>
          <Gnb.List>
            <Gnb.Item className="shrink-0">
              <Link href="/" aria-label="홈으로 이동" className="inline-flex items-center pl-4">
                {logo}
              </Link>
            </Gnb.Item>
            <Gnb.Item>
              {ROUTES.map((route) => (
                <Gnb.Link key={route.href} asChild>
                  <Link href={route.href}>{route.label}</Link>
                </Gnb.Link>
              ))}
            </Gnb.Item>
          </Gnb.List>
          <Gnb.List>
            <Gnb.Link asChild>
              <Link href="/auth">로그인</Link>
            </Gnb.Link>
          </Gnb.List>
        </Gnb>
      </div>

      <div className="flex w-full items-center justify-between px-4 py-2 md:hidden">
        <Link href="/" aria-label="홈으로 이동" className="inline-flex shrink-0 items-center overflow-visible">
          {logo}
        </Link>

        <Sheet>
          <Sheet.Trigger asChild>
            <button type="button" aria-label="메뉴 열기" className="rounded-md p-1 hover:bg-muted">
              <Menu className="size-6" />
            </button>
          </Sheet.Trigger>
          <Sheet.Content side="right" showCloseButton>
            <Sheet.Header>
              <Sheet.Title>메뉴</Sheet.Title>
            </Sheet.Header>
            <Sheet.List>
              {ROUTES.map((route) => (
                <Sheet.Item key={route.href}>
                  <Sheet.Close asChild>
                    <Link href={route.href} className="block rounded-md p-3 font-medium text-sm">
                      {route.label}
                    </Link>
                  </Sheet.Close>
                </Sheet.Item>
              ))}
            </Sheet.List>
            <Sheet.Footer>
              <Sheet.Close asChild>
                <Link href="/auth">로그인</Link>
              </Sheet.Close>
            </Sheet.Footer>
          </Sheet.Content>
        </Sheet>
      </div>
    </>
  );
};
