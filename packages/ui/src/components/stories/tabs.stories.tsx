import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "../ui/tabs/tabs";

const meta = {
  title: "components/tabs",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
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
          <Tabs defaultTab="my-groups" size="large" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="my-groups">나의 모임</Tabs.Trigger>
              <Tabs.Trigger value="created-groups">내가 만든 모임</Tabs.Trigger>
              <Tabs.Trigger value="liked-groups">찜한 모임</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="my-groups" className="pt-6 text-white">
              large / my-groups
            </Tabs.Content>
            <Tabs.Content value="created-groups" className="pt-6 text-white">
              large / created-groups
            </Tabs.Content>
            <Tabs.Content value="liked-groups" className="pt-6 text-white">
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

            <Tabs.Content value="my-groups" className="pt-6 text-white">
              small / my-groups
            </Tabs.Content>
            <Tabs.Content value="created-groups" className="pt-6 text-white">
              small / created-groups
            </Tabs.Content>
            <Tabs.Content value="liked-groups" className="pt-6 text-white">
              small / liked-groups
            </Tabs.Content>
          </Tabs>
        </div>
      </div>
    );
  },
};
