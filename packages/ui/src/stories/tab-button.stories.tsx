import type { Meta, StoryObj } from "@storybook/react";
import { TabButton } from "../components/ui/tabs/tab-button";

const meta = {
  title: "components/tab-button",
  component: TabButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "active"],
    },
    size: {
      control: "select",
      options: ["small", "large"],
    },
    children: {
      control: "text",
    },
  },
  args: {
    children: "전체",
    variant: "default",
    size: "small",
  },
} satisfies Meta<typeof TabButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    variant: "active",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "Large",
  },
};

export const AllCases: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-16">
        <div className="flex items-center gap-12">
          <TabButton size="small" variant="default">
            진행 중
          </TabButton>
          <TabButton size="small" variant="active">
            진행 종료
          </TabButton>
        </div>

        <div className="flex items-center gap-12">
          <TabButton size="large" variant="default">
            프로젝트
          </TabButton>
          <TabButton size="large" variant="active">
            스터디
          </TabButton>
        </div>
      </div>
    );
  },
};
