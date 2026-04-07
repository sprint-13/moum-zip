"use client";

import { Gnb, Sheet } from "@moum-zip/ui/components";
import { Menu } from "@moum-zip/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/_pages/auth/actions";
import Logo from "@/shared/assets/moum-zip-logo.svg";
import { NAVIGATION_ROUTES, ROUTES } from "@/shared/config/routes";

const logo = <Logo className="block h-8 w-auto" aria-hidden preserveAspectRatio="xMidYMid meet" />;

type NavigationMenuClientProps = {
  loggedIn: boolean;
  user?: {
    imageUrl?: string;
    name?: string;
  } | null;
};

interface NavigationProfileAvatarProps {
  imageUrl?: string;
  name?: string;
}

const NavigationProfileAvatar = ({ imageUrl, name }: NavigationProfileAvatarProps) => {
  if (imageUrl) {
    return (
      <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card">
        <Image
          src={imageUrl}
          alt={name ? `${name} 프로필 이미지` : "프로필 이미지"}
          fill
          className="rounded-full object-cover"
          sizes="44px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card"
      role="img"
      aria-label={name ? `${name} 프로필 이미지` : "프로필 이미지"}
    >
      <svg viewBox="0 0 24 24" className="size-6 text-muted-foreground" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" fill="currentColor" opacity="0.5" />
        <path
          d="M6.75 18.25C6.75 15.9028 9.09779 14 12 14C14.9022 14 17.25 15.9028 17.25 18.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const NavigationMenuClient = ({ loggedIn, user }: NavigationMenuClientProps) => {
  return (
    <>
      <div className="hidden w-full py-2 md:block">
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
          <Gnb.List className="items-center gap-1">
            {loggedIn ? (
              <>
                <Gnb.Item>
                  <Gnb.Link asChild>
                    <button type="button" onClick={() => logoutAction()}>
                      로그아웃
                    </button>
                  </Gnb.Link>
                </Gnb.Item>
                <Gnb.Item>
                  <Link
                    href={ROUTES.mypage}
                    aria-label="마이페이지로 이동"
                    className="inline-flex shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1"
                  >
                    <NavigationProfileAvatar imageUrl={user?.imageUrl} name={user?.name} />
                  </Link>
                </Gnb.Item>
              </>
            ) : (
              <Gnb.Item>
                <Gnb.Link asChild>
                  <Link href={ROUTES.login}>로그인</Link>
                </Gnb.Link>
              </Gnb.Item>
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
              {loggedIn ? (
                <Sheet.Item>
                  <Sheet.Close asChild>
                    <Link href={ROUTES.mypage} className="block rounded-md p-3 font-medium text-sm">
                      마이페이지
                    </Link>
                  </Sheet.Close>
                </Sheet.Item>
              ) : null}
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
