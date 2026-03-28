"use client";

import { Gnb, Sheet } from "@moum-zip/ui/components";
import { Menu } from "@moum-zip/ui/icons";
import Link from "next/link";
import { logoutAction } from "@/_pages/auth/actions";
import Logo from "@/shared/assets/moum-zip-logo.svg";
import { NAVIGATION_ROUTES, ROUTES } from "@/shared/config/routes";

const logo = <Logo className="block h-8 w-auto" aria-hidden preserveAspectRatio="xMidYMid meet" />;

export const NavigationMenuClient = ({ loggedIn }: { loggedIn: boolean }) => {
  return (
    <>
      <div className="hidden w-full py-5 md:block">
        <Gnb viewport={false}>
          <Gnb.List>
            <Gnb.Item className="shrink-0">
              <Link href={ROUTES.home} aria-label="홈으로 이동" className="inline-flex items-center pl-4">
                {logo}
              </Link>
            </Gnb.Item>
            <Gnb.Item>
              {NAVIGATION_ROUTES.map((route) => (
                <Gnb.Link key={route.href} asChild>
                  <Link href={route.href}>{route.label}</Link>
                </Gnb.Link>
              ))}
            </Gnb.Item>
          </Gnb.List>
          <Gnb.List>
            {loggedIn ? (
              <Gnb.Link asChild>
                <button type="button" onClick={() => logoutAction()}>
                  로그아웃
                </button>
              </Gnb.Link>
            ) : (
              <Gnb.Link asChild>
                <Link href={ROUTES.login}>로그인</Link>
              </Gnb.Link>
            )}
          </Gnb.List>
        </Gnb>
      </div>

      <div className="flex w-full items-center justify-between px-4 py-2 md:hidden">
        <Link
          href={ROUTES.home}
          aria-label="홈으로 이동"
          className="inline-flex shrink-0 items-center overflow-visible"
        >
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
              {NAVIGATION_ROUTES.map((route) => (
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
              {loggedIn ? (
                <Sheet.Close asChild>
                  <button type="button" onClick={() => logoutAction()}>
                    로그아웃
                  </button>
                </Sheet.Close>
              ) : (
                <Sheet.Close asChild>
                  <Link href={ROUTES.login}>로그인</Link>
                </Sheet.Close>
              )}
            </Sheet.Footer>
          </Sheet.Content>
        </Sheet>
      </div>
    </>
  );
};
