import type { Meta, StoryObj } from "@storybook/react";
import { Gnb } from "../components/ui/gnb";

const meta: Meta<typeof Gnb> = {
  title: "Components/Gnb",
  component: Gnb,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Gnb>;

export const Basic: Story = {
  render: () => {
    const handleLinkClick = (e: React.MouseEvent) => {
      e.preventDefault();
      console.log("Link clicked");
    };

    return (
      <section className="w-full">
        <Gnb>
          <Gnb.List>
            <Gnb.Item>
              <Gnb.Link href="/">
                <span className="font-bold">MOUM-ZIP</span>
              </Gnb.Link>
            </Gnb.Item>

            <Gnb.Item>
              {/* '#' 대신 유효한 경로를 사용하고 onClick으로 제어 */}
              <Gnb.Link asChild selected>
                <a href="/search" onClick={handleLinkClick}>
                  모임 찾기
                </a>
              </Gnb.Link>
            </Gnb.Item>
            <Gnb.Item>
              <Gnb.Link href="/wishlist" onClick={handleLinkClick}>
                찜한 모임
              </Gnb.Link>
            </Gnb.Item>
            <Gnb.Item>
              <Gnb.Link variant="sm" asChild>
                <a href="/space" onClick={handleLinkClick}>
                  스페이스 <span className="ml-1 text-[10px] text-primary">●</span>
                </a>
              </Gnb.Link>
            </Gnb.Item>
          </Gnb.List>

          <Gnb.List>
            <Gnb.Item className="px-4 text-sm text-gray-400">아이콘</Gnb.Item>
            <Gnb.Item>
              <Gnb.Link href="/notifications" onClick={handleLinkClick}>
                알림
              </Gnb.Link>
            </Gnb.Item>
          </Gnb.List>
        </Gnb>
      </section>
    );
  },
};
