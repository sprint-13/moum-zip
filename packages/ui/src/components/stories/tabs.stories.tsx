import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "../ui/tabs/tabs";

const meta = {
  title: "components/tabs",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "foreground",
      values: [{ name: "foreground", value: "var(--color-foreground)" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllCases: Story = {
  render: () => {
    return (
      <div className="flex w-full flex-col gap-16 p-8">
        <div className="w-full">
          <Tabs className="w-full" defaultTab="my-groups" size="large">
            <Tabs.List>
              <Tabs.Trigger value="my-groups">나의 모임</Tabs.Trigger>
              <Tabs.Trigger value="created-groups">내가 만든 모임</Tabs.Trigger>
              <Tabs.Trigger value="liked-groups">찜한 모임</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className="pt-6 text-background" value="my-groups">
              large / my-groups
            </Tabs.Content>
            <Tabs.Content className="pt-6 text-background" value="created-groups">
              large / created-groups
            </Tabs.Content>
            <Tabs.Content className="pt-6 text-background" value="liked-groups">
              large / liked-groups
            </Tabs.Content>
          </Tabs>
        </div>

        <div className="w-fit">
          <Tabs defaultTab="my-groups" size="small">
            <Tabs.List>
              <Tabs.Trigger value="my-groups">나의 모임</Tabs.Trigger>
              <Tabs.Trigger value="created-groups">내가 만든 모임</Tabs.Trigger>
              <Tabs.Trigger value="liked-groups">찜한 모임</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className="pt-6 text-background" value="my-groups">
              small / my-groups
            </Tabs.Content>
            <Tabs.Content className="pt-6 text-background" value="created-groups">
              small / created-groups
            </Tabs.Content>
            <Tabs.Content className="pt-6 text-background" value="liked-groups">
              small / liked-groups
            </Tabs.Content>
          </Tabs>
        </div>
      </div>
    );
  },
};
