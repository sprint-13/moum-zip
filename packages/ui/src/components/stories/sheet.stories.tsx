import type { Meta, StoryObj } from "@storybook/react";
import { Bell, ChevronRight, X } from "lucide-react";
import { Sheet } from "../ui/sheet";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/* ------------------------------------------------------------------ */
/*  알림 Sheet - 알림 목록 있음                                         */
/* ------------------------------------------------------------------ */

const notifications = [
  {
    id: 1,
    title: "모임 확정",
    description: "'힐링 오피스 스트레칭' 모임 개설이 확정되었어요!",
    trailing: "1분 전",
    badge: 1,
  },
  {
    id: 2,
    title: "모임 취소",
    description: "'힐링 오피스 스트레칭' 모임이 취소되었어요.",
    trailing: "2시간 전",
    badge: 0,
  },
  {
    id: 3,
    title: "새로운 댓글",
    description: '클라이밍 어때요? - 팔기님의 댓글 "정말 재밌어요 :)"',
    trailing: "4일 전",
    badge: 0,
  },
  {
    id: 4,
    title: "모임 내용 변경",
    description: "'키테 두어 멤버 모집' 모임 내용이 변경되었어요.",
    trailing: "5일 전",
    badge: 0,
  },
];

const AlarmCard = ({ title }: { title: string }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-md bg-muted" />
        <div>
          <p className="font-medium text-sm">모임 확정</p>
          <p className="text-muted-foreground text-sm">{title}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export const NotificationWithItems: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <button type="button" className="rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-muted">
          알림 열기
        </button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Bell className="size-4 text-foreground" />
          <Sheet.Title>알림 내역</Sheet.Title>
        </Sheet.Header>

        <Sheet.List>
          {notifications.map((n) => (
            <Sheet.Item key={n.id}>
              <AlarmCard title={n.description} />
            </Sheet.Item>
          ))}
        </Sheet.List>
      </Sheet.Content>
    </Sheet>
  ),
};

/* ------------------------------------------------------------------ */
/*  알림 Sheet - 빈 상태                                               */
/* ------------------------------------------------------------------ */

export const NotificationEmpty: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <button type="button" className="rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-muted">
          알림 열기 (빈 상태)
        </button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Bell className="size-4 text-foreground" />
          <Sheet.Title>알림 내역</Sheet.Title>
        </Sheet.Header>
      </Sheet.Content>
    </Sheet>
  ),
};

/* ------------------------------------------------------------------ */
/*  메뉴 Sheet - 로그인                                                */
/* ------------------------------------------------------------------ */

const menuItems = [
  { label: "모임 찾기", href: "/search", active: true },
  { label: "찜한 모임", href: "/wishlist", badge: 1 },
  { label: "스페이스", href: "/space" },
  { label: "마이페이지", href: "/my" },
];

const NavCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between px-4 py-8">
      <div>{children}</div>
      <ChevronRight />
    </div>
  );
};

export const MenuLoggedIn: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <button type="button" className="rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-muted">
          메뉴 열기 (로그인)
        </button>
      </Sheet.Trigger>
      <Sheet.Content showCloseButton={false}>
        <Sheet.Header>
          <Sheet.Close>
            <X />
          </Sheet.Close>
        </Sheet.Header>

        <Sheet.List>
          {menuItems.map((item) => (
            <Sheet.Item key={item.label} onClick={(e) => e.preventDefault()}>
              <NavCard>{item.label}</NavCard>
            </Sheet.Item>
          ))}
        </Sheet.List>
      </Sheet.Content>
    </Sheet>
  ),
};

/* ------------------------------------------------------------------ */
/*  메뉴 Sheet - 비로그인                                              */
/* ------------------------------------------------------------------ */

export const MenuGuest: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <button type="button" className="rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-muted">
          메뉴 열기 (비로그인)
        </button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header className="justify-between">
          <Sheet.Title>제목</Sheet.Title>
          <Sheet.Close>
            <X />
          </Sheet.Close>
        </Sheet.Header>

        <Sheet.List>
          {menuItems.concat(menuItems, menuItems).map((item) => (
            <Sheet.Item key={item.label} onClick={(e) => e.preventDefault()}>
              <NavCard>{item.label}</NavCard>
            </Sheet.Item>
          ))}
        </Sheet.List>

        <Sheet.Footer>
          <button
            type="button"
            className="w-full text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            로그인
          </button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  ),
};
