import { CountBadge, Gnb } from "@ui/components";
import Image from "next/image";
import Link from "next/link";

import { SPACE_SEARCH_ASSETS, SPACE_SEARCH_NAV_ITEMS } from "../constants";

export const SpaceSearchHeader = () => {
  const hasUnreadNotifications = true;

  return (
    <header className="bg-background-basic">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link className="inline-flex shrink-0 items-center p-2" href="/">
            <Image
              alt="로고"
              className="w-23.75"
              height={23}
              src={SPACE_SEARCH_ASSETS.logoSrc}
              unoptimized
              width={96}
            />
          </Link>

          <Gnb className="mx-0 hidden w-auto max-w-none flex-none justify-start md:flex" viewport={false}>
            <Gnb.List className="gap-0">
              {SPACE_SEARCH_NAV_ITEMS.map(({ href, id, isActive, label, notificationCount }) => (
                <Gnb.Item className="shrink-0" key={id}>
                  <Gnb.Link asChild selected={isActive}>
                    <Link className="inline-flex items-center gap-1" href={href}>
                      <span>{label}</span>
                      {notificationCount ? <CountBadge count={notificationCount} size="small" /> : null}
                    </Link>
                  </Gnb.Link>
                </Gnb.Item>
              ))}
            </Gnb.List>
          </Gnb>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <button
            aria-label={hasUnreadNotifications ? "새 알림 있음" : "알림"}
            className="relative inline-flex size-10 items-center justify-center rounded-full"
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-6"
              height={24}
              src={SPACE_SEARCH_ASSETS.notificationBellIconSrc}
              unoptimized
              width={24}
            />
            <span className="absolute top-1.75 right-2.25 size-2 rounded-full bg-primary" />
          </button>

          <button aria-label="프로필" className="inline-flex size-13.5 items-center justify-center" type="button">
            <span className="inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
              <Image
                alt=""
                aria-hidden="true"
                className="size-full object-cover"
                height={44}
                src={SPACE_SEARCH_ASSETS.avatarSrc}
                unoptimized
                width={44}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
