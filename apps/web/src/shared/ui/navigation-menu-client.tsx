"use client";

import { Gnb, Sheet } from "@moum-zip/ui/components";
import { Menu } from "@moum-zip/ui/icons";
import Link from "next/link";
import { logoutAction } from "@/_pages/auth/actions";
import { NotificationMenu } from "@/features/notification/ui/notification-menu";
import Logo from "@/shared/assets/moum-zip-logo.svg";
import { NAVIGATION_ROUTES, ROUTES } from "@/shared/config/routes";
import { ProfileAvatar } from "@/shared/ui";

const logo = <Logo className="block h-8 w-auto" aria-hidden preserveAspectRatio="xMidYMid meet" />;

type NavigationNotification = {
  id: number;
  teamId: string;
  userId: number;
  type: "MEETING_CONFIRMED" | "MEETING_CANCELED" | "COMMENT";
  message: string;
  data: {
    meetingId?: number;
    meetingName?: string;
    postId?: number;
    postTitle?: string;
    commentId?: number;
    image?: string | null;
  };
  isRead: boolean;
  createdAt: string | null;
};

type NavigationMenuClientProps = {
  loggedIn: boolean;
  user?: {
    imageUrl?: string;
    name?: string;
  } | null;
  notifications: NavigationNotification[];
};

export const NavigationMenuClient = ({ loggedIn, user, notifications }: NavigationMenuClientProps) => {
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

          <Gnb.List className="items-center gap-2 pr-4">
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
                  <NotificationMenu notifications={notifications} />
                </Gnb.Item>

                <Gnb.Item>
                  <Link
                    href={ROUTES.mypage}
                    aria-label="마이페이지로 이동"
                    className="inline-flex shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1"
                  >
                    <ProfileAvatar
                      className="size-10 border-border"
                      src={user?.imageUrl}
                      alt={user?.name ? `${user.name} 프로필 이미지` : "프로필 이미지"}
                    />
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

        <div className="flex items-center gap-2">
          {loggedIn ? <NotificationMenu notifications={notifications} /> : null}

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
      </div>
    </>
  );
};
